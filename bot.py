from discord.ext import commands
import discord
import asyncio

# bot token - do not steal!
token = "NDE3MzI4MDk4OTkyOTc5OTgz.D02o-w.l2BI_l8Xr4OdDb_91xkoZ8DTayk"
prefix = "?"
# create client object
client = discord.Client()

# create bot object
bot = commands.Bot(command_prefix=prefix,description="ATIS Bot",case_insensitive=True)

# the list of airports to search from
airports = {"kmia":["Miami International Airport",
                "https://www.liveatc.net/hlisten.php?mount=kmia3_atis_arr&icao=kmia",
                "https://www.liveatc.net/hlisten.php?mount=kmia3_atis_dep&icao=kmia"],
            "katl":["Hartsfield - Jackson Atlanta International Airport",
                "https://www.liveatc.net/hlisten.php?mount=katl_atis_arr&icao=katl",
                "https://www.liveatc.net/hlisten.php?mount=katl_atis_dep&icao=katl"],
            "klax":["Los Angeles International Airport",
                "https://www.liveatc.net/hlisten.php?mount=klax4n_atis_arr&icao=klax",
                "https://www.liveatc.net/hlisten.php?mount=klax4n_atis_dep&icao=klax"],
            "kdfw":["Dallas/Fort Worth International Airport",
                "https://www.liveatc.net/hlisten.php?mount=kdfw1_atis_arr&icao=kdfw"],
            "kjfk":["John F Kennedy International Airport",
                "https://www.liveatc.net/hlisten.php?mount=kjfk_atis&icao=kjfk"],
            "ksfo":["San Francisco International Airport",
                "https://www.liveatc.net/hlisten.php?mount=ksfo_atis&icao=ksfo"],
            "klas":["Mc Carran International Airport",
                "https://www.liveatc.net/hlisten.php?mount=klas5_atis&icao=klas"],
            "kewr":["Newark Liberty International Airport",
                "https://www.liveatc.net/hlisten.php?mount=kewr3_atis&icao=kewr"],
            "kmco":["Orlando International Airport",
                "https://www.liveatc.net/hlisten.php?mount=kmco7&icao=kmco"],
            "kiah":["George Bush Intercontinental/Houston Airport",
                "https://www.liveatc.net/hlisten.php?mount=kiah2_atis_main&icao=kiah",
                "https://www.liveatc.net/hlisten.php?mount=kiah2_atis_const&icao=kiah"],
            "kmsp":["Minneapolis-St Paul International/Wold-Chamberlain Airport",
                "https://www.liveatc.net/hlisten.php?mount=kmsp4_atis_arr&icao=kmsp",
                "https://www.liveatc.net/hlisten.php?mount=kmsp3_atis_dep&icao=kmsp"],
            "kfll":["Fort Lauderdale/Hollywood International Airport",
                "https://www.liveatc.net/hlisten.php?mount=kfll1_atis&icao=kfll"],
            "klga":["LaGuardia Airport",
                "https://www.liveatc.net/hlisten.php?mount=klga_atis_dep&icao=klga"],
            "kbwi":["Baltimore/Washington International Thurgood Marshall Airport",
                "https://www.liveatc.net/hlisten.php?mount=kbwi1_pi_atis&icao=kbwi"],
            "kmdw":["Chicago Midway International Airport",
                "https://www.liveatc.net/hlisten.php?mount=kmdw_4&icao=kmdw"],
            "kjax":["Jacksonville International Airport",
                "https://www.liveatc.net/hlisten.php?mount=kjax_atis&icao=kjax"]}

@bot.command()
async def atis(ctx,*icao): # the ATIS command
    """
    retrieve ATIS frequencies of airports
    """
    if (len(icao) == 0): # no parameter passed
        await ctx.send(":no_entry_sign: Usage: `?atis <airport ICAO code>`")
    elif (icao[0].lower() in airports): # parameter is in the list of airports
        if (len(airports[icao[0].lower()]) == 2): # has only one ATIS frequency
            await ctx.send("%s ATIS Frequency for **%s** (%s):\n%s" %(ctx.author.mention,icao[0].upper(),airports[icao[0].lower()][0],airports[icao[0].lower()][1]))
        else: # has both arr ATIS and dep ATIS
            await ctx.send("%s ATIS Frequencies for **%s** (%s):\n-ARRival: %s\n-DEParture: %s" %(ctx.author.mention,icao[0].upper(),airports[icao[0].lower()][0],airports[icao[0].lower()][1],airports[icao[0].lower()][2]))
    else: # invalid airport ICAO code
        await ctx.send(":no_entry_sign: \"%s\" is not an airport or is not yet available" %(icao[0].upper()))

@bot.command()
async def clear(ctx): # the clear channel command
    """
    Clear all unpinned messages in this channel
    """
    await ctx.channel.purge(limit=None, check=lambda msg: not msg.pinned)

@bot.event
async def on_ready(): # Bot ready
    print("Bot-Ready")

@bot.event
async def on_command_error(ctx, error): # invalid command
    if isinstance(error, commands.CommandNotFound):
        await ctx.send(":no_entry_sign: \"%s\" is not a valid command" %(ctx.invoked_with))
    else:
        raise error

@client.event
async def on_ready():
    print("Client-Ready")

@client.event
async def on_message(message): # delete non-bot-command message
    if (message.author != client.user and not(message.author.bot) and message.content[0] != prefix): # is not itself AND not a bot AND doesn't start with "?"
        await message.delete()

# run the bot
loop = asyncio.get_event_loop()
loop.create_task(bot.start(token))
loop.create_task(client.start(token))
loop.run_forever()
