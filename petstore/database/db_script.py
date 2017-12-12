import sqlite3

conn = sqlite3.connect('pet_store.db')

#Specify the encoding so that special characters are displayed.
conn.text_factory = lambda x: str(x, 'iso-8859-1')

c = conn.cursor()

animals = [("Frog","Small","Jumpy"),("Cat","Medium","Cold"),("Dog","Big","Loving"),("Turtle","Small","Funny"),("Snake","Big","Hissy"),("Mouse","small","Nervous"),("Eagle","Big","Patriotic"),("Horse","Big","Playful"),("Goldfish","Small","Distant"),("Pangolin","Small","Awesome")]
for (v1,v2,v3) in animals:
    c.execute('''INSERT INTO pets(species, size, mood) VALUES(?,?,?) ''', (v1, v2, v3))
conn.commit()
conn.close()

