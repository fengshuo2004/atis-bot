# ATIS source entry manager
# By David Feng 2019
# You must install Python 3 to run this program

import os
import json

os.system('COPY airports.json airports.json.bak /Y')

with open("airports.json", "r") as f:
    db = json.loads(f.read())

while True:
    ans = input("New airport ICAO (Q to QUIT): ").lower()
    if ans == "q":
        break
    if ans in db.keys():
        print("Already in database!")
        continue
    nam = input("[" + ans.upper() + "] FULL NAME: ")
    u1 = input("[" + ans.upper() + "] URL 1 SUFFIX arrival: ")
    u2 = input(
        "[" + ans.upper() + "] URL 2 SUFFIX departure (hit ENTER if only one): ")
    print("Adding...")
    if u2 == "":
        db[ans] = [nam, "http://d.liveatc.net/" + u1]
    else:
        db[ans] = [nam, "http://d.liveatc.net/" +
                   u1, "http://d.liveatc.net/" + u2]

print(db)
print("=====================================================")
while True:
    ok = input(
        "You are about to quit. Is this ok?\nY = SAVE changes\nN = DISCARD cahnges\n> ").lower()
    if ok == "y":
        with open("airports.json", "w") as f:
            f.write(json.dumps(db))
        print("Saved and done")
        raise SystemExit()
    elif ok == "n":
        os.system("DEL airports.json.bak")
        print("Discarded and done")
        raise SystemExit()
    else:
        print("U WOT?")
