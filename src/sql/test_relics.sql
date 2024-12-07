DELETE FROM relic_rewards;
DELETE FROM relics;
INSERT INTO relics(id, era, name, release_date)
VALUES ('/Lotus/Relics/ID1', 'Axi', 'A1', datetime('now', '+1 minutes'));/*,
       ('/Lotus/Relics/ID2', 'Axi', 'A2', datetime('now+02:00:00')),
       ('/Lotus/Relics/ID3', 'Lith', 'A1', datetime('now+03:00:00')),
       ('/Lotus/Relics/ID4', 'Neo', 'B1', datetime('now+01:00:00')),
       ('/Lotus/Relics/ID5', 'Neo', 'B2', datetime('now+02:00:00'));*/

INSERT INTO relic_rewards(item_id, name_en, rarity, relic_id)
VALUES ('/Lotus/Items/ID1', 'Acceltra Prime Blueprint', 'Rare', '/Lotus/Relics/ID1');