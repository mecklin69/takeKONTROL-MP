/**
 * takeKONTROL — kit contents: products, manufacturers, categories
 * =================================================================
 * Real compliance content for what is actually inside each kit:
 * per-item description, safety note, manufacturer / EU-representative
 * details (name, address, WEEE and battery registration numbers) and,
 * for food items, the legally required nutrition and allergen facts.
 *
 * Ingredient lists, allergens, storage and preparation instructions are
 * kept in German only, exactly as printed on the pack — that is the
 * legally binding wording and is not translated, matching how the shop
 * itself already handles food labelling elsewhere on the site.
 * =================================================================
 */

export const PRODUCTS = {
  "multifunktionstuch": {
    "name": {
      "de": "Multifunktionstuch",
      "en": "Multifunctional scarf"
    },
    "what": {
      "de": "Schlauchförmiges Textil für Hals oder Kopf.",
      "en": "Tubular textile for neck or head."
    },
    "why": {
      "de": "Bietet leichte Wärme sowie Komfort gegen Sonne und Staub.",
      "en": "Gives light warmth and comfort against sun and dust."
    },
    "safety": {
      "de": "Keine zertifizierte Atem-, Aufprall- oder Flammschutzwirkung; von Maschinen und Feuer fernhalten.",
      "en": "No certified respiratory, impact or flame protection; keep away from machinery and fire."
    },
    "manufacturerId": "buff"
  },
  "batteriebetriebenes-notfallradio": {
    "name": {
      "de": "Batteriebetriebenes Notfallradio",
      "en": "Battery-powered emergency radio"
    },
    "what": {
      "de": "Tragbares Radio für öffentliche Rundfunkinformationen.",
      "en": "Portable radio for public broadcast information."
    },
    "why": {
      "de": "Erhält Nachrichten und Warnungen, wenn Mobilfunk oder Internet ausfallen.",
      "en": "Receives news and warnings when mobile networks or the internet fail."
    },
    "safety": {
      "de": "Empfang und Batterien regelmäßig testen; vor Nässe und großer Hitze schützen.",
      "en": "Test reception and batteries regularly; protect from moisture and high heat."
    },
    "manufacturerId": "tpvision",
    "model": "Philips TAR1609/00",
    "registration": {
      "weee": "DE 58581960",
      "battery": "DE 78952663",
      "registeredVia": "TP Vision Europe B.V., Niederlassung Deutschland"
    }
  },
  "seven-oceans-notfalltrinkwasser": {
    "name": {
      "de": "Seven OceanS Notfalltrinkwasser",
      "en": "Seven OceanS emergency drinking water"
    },
    "what": {
      "de": "Langzeitfähiges Trinkwasser in versiegelten Portionsbeuteln.",
      "en": "Long-life drinking water in sealed portion pouches."
    },
    "why": {
      "de": "Stellt unmittelbar trinkbares Wasser bereit, wenn die reguläre Versorgung ausfällt.",
      "en": "Provides immediately drinkable water when the regular supply fails."
    },
    "safety": {
      "de": "Nur unbeschädigte, dichte Beutel innerhalb des Mindesthaltbarkeitsdatums verwenden.",
      "en": "Use only undamaged, sealed pouches within the best-before date."
    },
    "manufacturerId": "seven",
    "manufacturerText": "Compact Food Solutions AS, Smoget 29, 5212 Søfteland, Norwegen",
    "model": "Seven OceanS 500 ml",
    "food": [
      {
        "legalName": {
          "de": "Verpacktes Trinkwasser für den Notfall",
          "en": "Packaged emergency drinking water"
        },
        "ingredients": "Trinkwasser.",
        "allergens": "Keine kennzeichnungspflichtigen Allergene zu erwarten.",
        "netQuantity": "2 × 500 ml (1 l gesamt)",
        "nutrition": {
          "energyKj": "",
          "energyKcal": "",
          "fat": "",
          "saturates": "",
          "carbohydrate": "",
          "sugars": "",
          "protein": "",
          "salt": ""
        },
        "notes": "Nährwertdeklaration für Wasser nach Anhang V LMIV grundsätzlich ausgenommen. KEINE Werte erfinden.",
        "storage": "Versiegelt lagern, vor Durchstich und Verunreinigung schützen, vor Ablauf des MHD verwenden.",
        "preparation": "Trinkfertig. Eine Portion nach der anderen öffnen.",
        "origin": "Herstellung Norwegen.",
        "operator": "Compact Food Solutions AS (Marke Seven OceanS)",
        "operatorAddress": "Smoget 29, 5212 Søfteland, Norwegen."
      }
    ]
  },
  "taschentuecher": {
    "name": {
      "de": "Taschentücher",
      "en": "Pocket tissues"
    },
    "what": {
      "de": "Kompakte Einwegtaschentücher.",
      "en": "Compact disposable tissues."
    },
    "why": {
      "de": "Unterstützen einfache Nasen-, Gesichts- und Alltagshygiene.",
      "en": "Support simple nose, face and everyday hygiene."
    },
    "safety": {
      "de": "Trocken lagern und verantwortungsvoll entsorgen.",
      "en": "Store dry and dispose of responsibly."
    },
    "manufacturerId": "cheeky"
  },
  "sea-gold-heringsfilets-in-paprika-creme": {
    "name": {
      "de": "Sea Gold Heringsfilets in Paprika-Creme",
      "en": "Sea Gold herring fillets in paprika cream"
    },
    "what": {
      "de": "Verzehrfertige Heringsfilets in Paprikacreme.",
      "en": "Ready-to-eat herring fillets in paprika cream."
    },
    "why": {
      "de": "Liefert haltbares Eiweiß und Fett ohne umfangreiche Zubereitung.",
      "en": "Provides long-life protein and fat without much preparation."
    },
    "safety": {
      "de": "Enthält Fisch und Senf; nach Öffnung kühlen; scharfe Dosendeckelkanten beachten.",
      "en": "Contains fish and mustard; refrigerate after opening; beware sharp can-lid edges."
    },
    "manufacturerId": "netto",
    "manufacturerText": "Netto Marken-Discount Stiftung und Co. KG",
    "model": "200 g",
    "food": [
      {
        "legalName": {
          "de": "Heringsfilets in Paprikacreme mit eingelegten Paprikastücken",
          "en": "Herring fillets in paprika cream with pickled pepper pieces"
        },
        "ingredients": "60 % HERINGSfilet, Wasser, Rapsöl, 4,7 % eingelegte rote und grüne Paprika (Paprika, Wasser, Branntweinessig, Zucker, Salz, Festigungsmittel Calciumchlorid), Zuckersirup (Zucker, Wasser), dreifach konzentriertes Tomatenmark, 0,98 % Paprikapaste (Paprika, Säuerungsmittel Citronensäure), Kartoffelstärke, Salz, SENF (Wasser, SENFsaat, Branntweinessig, Salz, Gewürze), Verdickungsmittel Guarkernmehl, Branntweinessig, Gewürze, Gewürzextrakte (enthält SENF), Farbstoff Paprikaextrakt.",
        "allergens": "Enthält FISCH und SENF.",
        "traces": "Kann SELLERIE, MILCH, EI, SOJA und GLUTEN enthalten.",
        "netQuantity": "200 g",
        "nutrition": {
          "energyKj": "799",
          "energyKcal": "192",
          "fat": "14.0",
          "saturates": "2.1",
          "carbohydrate": "",
          "sugars": "",
          "protein": "",
          "salt": ""
        },
        "storage": "Nach dem Öffnen kühlen und rasch verbrauchen. MHD auf der Unterseite beachten.",
        "preparation": "Verzehrfertig. Beim Öffnen entstehen scharfe Metallkanten.",
        "operator": "Hergestellt für Netto Marken-Discount Stiftung & Co. KG",
        "operatorAddress": "Industriepark Ponholz 1, 93142 Maxhütte-Haidhof, Deutschland."
      }
    ]
  },
  "uno-kartenspiel": {
    "name": {
      "de": "UNO Kartenspiel",
      "en": "UNO card game"
    },
    "what": {
      "de": "Kompaktes Kartenspiel.",
      "en": "Compact card game."
    },
    "why": {
      "de": "Schafft Beschäftigung, soziale Interaktion und Ruhephasen bei längerem Aufenthalt zu Hause.",
      "en": "Creates activity, social contact and calm during longer stays at home."
    },
    "safety": {
      "de": "Kleinteile von kleinen Kindern fernhalten; vollständiges Set trocken lagern.",
      "en": "Keep small parts away from young children; store the complete set dry."
    },
    "manufacturerId": "mattel"
  },
  "freytag-berndt-deutschlandkarte-1-500-000": {
    "name": {
      "de": "Freytag & Berndt Deutschlandkarte 1:500.000",
      "en": "Freytag & Berndt Germany map 1:500,000"
    },
    "what": {
      "de": "Gedruckte Straßenkarte Deutschlands.",
      "en": "Printed road map of Germany."
    },
    "why": {
      "de": "Ermöglicht Routenplanung ohne Strom, Mobilfunk oder GPS.",
      "en": "Allows route planning without power, mobile network or GPS."
    },
    "safety": {
      "de": "Sperrungen und aktuelle Gefahren können fehlen; mit amtlichen Hinweisen abgleichen.",
      "en": "Closures and current hazards may be missing; check against official guidance."
    },
    "manufacturerId": "freytag",
    "manufacturerText": "Freytag-Berndt und Artaria KG",
    "model": "1:500.000"
  },
  "wasa-rustikal": {
    "name": {
      "de": "Wasa Rustikal",
      "en": "Wasa Rustikal"
    },
    "what": {
      "de": "Vollkorn-Roggenknäckebrot mit Roggenkleie.",
      "en": "Wholegrain rye crispbread with rye bran."
    },
    "why": {
      "de": "Bietet eine haltbare, sofort verzehrbare Kohlenhydratquelle.",
      "en": "A long-life, ready-to-eat source of carbohydrates."
    },
    "safety": {
      "de": "Enthält Roggen und Gluten; trocken lagern und Packung nach Öffnung schützen.",
      "en": "Contains rye and gluten; store dry and protect the pack after opening."
    },
    "manufacturerId": "barilla",
    "manufacturerText": "Wasa Barilla Gruppe",
    "food": [
      {
        "legalName": {
          "de": "Rustikales Roggenknäckebrot mit Roggenkleie",
          "en": "Rustic rye crispbread with rye bran"
        },
        "ingredients": "VOLLKORN-ROGGENmehl 100 g je 100 g Produkt, ROGGENkleie 5 g, Salz, Hefe.",
        "allergens": "Enthält ROGGEN/GLUTEN.",
        "traces": "Kann Spuren von LUPINEN, MILCH, SENF, SESAM und SOJA enthalten.",
        "netQuantity": "ca. 275 g / 18 Scheiben",
        "nutrition": {
          "energyKj": "1389",
          "energyKcal": "330",
          "fat": "1.5",
          "saturates": "0.4",
          "carbohydrate": "60",
          "sugars": "1.5",
          "protein": "9.0",
          "salt": "1.2"
        },
        "notes": "Ballaststoffe 20 g.",
        "storage": "Trocken lagern, nach dem Öffnen vor Feuchtigkeit schützen.",
        "preparation": "Verzehrfertig. Haltbarer Brotersatz.",
        "operator": "Wasa / Barilla-Gruppe"
      }
    ]
  },
  "petex-kfz-verbandtasche-din-13164": {
    "name": {
      "de": "PETEX Erste-Hilfe-Set mit Rettungsdecken",
      "en": "PETEX first-aid kit with emergency blankets"
    },
    "what": {
      "de": "Erste-Hilfe-Tasche nach DIN 13164:2022, mit enthaltenen Rettungsdecken.",
      "en": "First-aid pouch to DIN 13164:2022, with emergency blankets included."
    },
    "why": {
      "de": "Unterstützt die Erstversorgung kleiner Verletzungen bis professionelle Hilfe eintrifft.",
      "en": "Supports first care of minor injuries until professional help arrives."
    },
    "safety": {
      "de": "Schulung empfohlen. Bei schweren Verletzungen Notruf 112. Siegel, Verfallsdaten und Inhalt regelmäßig prüfen. Rettungsdecken sind nicht flammfest.",
      "en": "Training recommended. Call 112 for serious injuries. Check seal, expiry dates and contents regularly. Emergency blankets are not flameproof."
    },
    "manufacturerId": "petex",
    "model": "DIN 13164:2022"
  },
  "reissfeste-abfallbeutel": {
    "name": {
      "de": "Reißfeste Abfallbeutel",
      "en": "Tear-resistant bin bags"
    },
    "what": {
      "de": "Große stabile Kunststoffbeutel für Abfall und Sekundärcontainment.",
      "en": "Large sturdy plastic bags for waste and secondary containment."
    },
    "why": {
      "de": "Unterstützen Hygiene, Sortierung und Trennung nasser Gegenstände.",
      "en": "Support hygiene, sorting and separating wet items."
    },
    "safety": {
      "de": "Erstickungsgefahr; von Kindern und Gesicht fernhalten; nicht als geschlossenen Unterschlupf verwenden.",
      "en": "Suffocation hazard; keep away from children and face; not for use as an enclosed shelter."
    },
    "manufacturerId": "tsp"
  },
  "vogtlandweide-h-vollmilch-3-5": {
    "name": {
      "de": "Vogtlandweide H-Vollmilch 3,5 %",
      "en": "Vogtlandweide UHT whole milk 3.5%"
    },
    "what": {
      "de": "Ultrahocherhitzte Vollmilch.",
      "en": "Ultra-heat-treated whole milk."
    },
    "why": {
      "de": "Ergänzt Getränke und Haferflocken und liefert Energie sowie Eiweiß.",
      "en": "Complements drinks and oat flakes and provides energy and protein."
    },
    "safety": {
      "de": "Enthält Milch; nach Öffnung kühlen und innerhalb der Packungsfrist verbrauchen.",
      "en": "Contains milk; refrigerate after opening and use within the stated time."
    },
    "manufacturerId": "vogtland",
    "model": "1 l",
    "food": [
      {
        "legalName": {
          "de": "H-Vollmilch, 3,5 % Fett",
          "en": "UHT whole milk, 3.5% fat"
        },
        "ingredients": "VOLLMILCH.",
        "allergens": "Enthält MILCH.",
        "netQuantity": "1 Liter",
        "nutrition": {
          "energyKj": "",
          "energyKcal": "",
          "fat": "",
          "saturates": "",
          "carbohydrate": "",
          "sugars": "",
          "protein": "",
          "salt": ""
        },
        "storage": "Ungeöffnet nach Packungsangabe. Nach dem Öffnen kühlen und innerhalb der angegebenen Zeit verbrauchen.",
        "preparation": "Trinkfertig; auch mit Haferflocken verwendbar.",
        "operator": "Vogtlandweide"
      }
    ]
  },
  "arbeitshandschuhe": {
    "name": {
      "de": "Arbeitshandschuhe",
      "en": "Work gloves"
    },
    "what": {
      "de": "Wiederverwendbare beschichtete Handschuhe.",
      "en": "Reusable coated gloves."
    },
    "why": {
      "de": "Verbessern Griff und reduzieren leichte Schürf- und Schmutzbelastung.",
      "en": "Improve grip and reduce minor abrasion and dirt."
    },
    "safety": {
      "de": "Nicht automatisch für Chemikalien, Schnitt, Hitze, Strom oder rotierende Maschinen geeignet.",
      "en": "Not automatically suitable for chemicals, cuts, heat, electricity or rotating machinery."
    },
    "manufacturerId": "atg",
    "model": "MaxiFlex Ultimate 34-874"
  },
  "ffp2-masken": {
    "name": {
      "de": "FFP2-Masken",
      "en": "FFP2 masks"
    },
    "what": {
      "de": "Partikelfiltrierende Halbmasken.",
      "en": "Particle-filtering half masks."
    },
    "why": {
      "de": "Reduzieren bei korrektem Sitz die Belastung durch Staub und luftgetragene Partikel.",
      "en": "When correctly fitted, reduce exposure to dust and airborne particles."
    },
    "safety": {
      "de": "Schützen nicht vor Gasen oder Sauerstoffmangel; Kennzeichnung und Haltbarkeit beachten.",
      "en": "Do not protect against gases or oxygen deficiency; observe marking and shelf life."
    },
    "manufacturerId": "polonord",
    "model": "FFP2 NR · EN 149"
  },
  "campinggeschirr-edelstahl": {
    "name": {
      "de": "Campinggeschirr Edelstahl",
      "en": "Stainless steel camping cookware"
    },
    "what": {
      "de": "Kompaktes Set aus Topf, Schale, Deckel und Essbesteck.",
      "en": "Compact set of pot, bowl, lid and cutlery."
    },
    "why": {
      "de": "Ermöglicht einfache Zubereitung und Verzehr, wenn keine Küche verfügbar ist.",
      "en": "Allows simple cooking and eating when no kitchen is available."
    },
    "safety": {
      "de": "Nur auf stabilem geeignetem Kocher verwenden; Metall wird heiß; niemals verschlossene Behälter erhitzen.",
      "en": "Use only on a stable suitable stove; metal gets hot; never heat closed containers."
    },
    "manufacturerId": "decathlon"
  },
  "kugelschreiber": {
    "name": {
      "de": "Kugelschreiber",
      "en": "Ballpoint pen"
    },
    "what": {
      "de": "Mechanischer Schreibstift.",
      "en": "Mechanical writing pen."
    },
    "why": {
      "de": "Ermöglicht Notizen, Kontakte und medizinische Angaben ohne Strom.",
      "en": "Lets you note contacts and medical details without power."
    },
    "safety": {
      "de": "Kleinteile von Kindern fernhalten; Tinte nicht für Haut oder Lebensmittelkontakt verwenden.",
      "en": "Keep small parts away from children; ink is not for skin or food contact."
    },
    "manufacturerId": "schneider",
    "model": "Slider Rave XB"
  },
  "anker-usb-c-ladegeraet-20-w": {
    "name": {
      "de": "Anker USB-C-Ladegerät 20 W mit Kabel",
      "en": "Anker USB-C charger 20 W with cable"
    },
    "what": {
      "de": "Netzteil mit USB-C Power Delivery, inklusive USB-C-Kabel.",
      "en": "Mains adapter with USB-C Power Delivery, including its USB-C cable."
    },
    "why": {
      "de": "Lädt kompatible Geräte schnell, wenn Netzstrom verfügbar ist.",
      "en": "Charges compatible devices quickly when mains power is available."
    },
    "safety": {
      "de": "Nur trocken und an geeigneter Steckdose verwenden; nicht abdecken; bei Beschädigung trennen.",
      "en": "Use only dry and at a suitable socket; do not cover; disconnect if damaged."
    },
    "manufacturerId": "anker",
    "model": "Anker B2348311 · 20 W",
    "registration": {
      "weee": "DE 74509260",
      "registeredVia": "ERP Deutschland GmbH für Anker Technology (UK) Ltd"
    }
  },
  "lebensmittelechter-wasserkanister": {
    "name": {
      "de": "Lebensmittelechter Wasserkanister 20 L",
      "en": "Food-safe water canister 20 L"
    },
    "what": {
      "de": "Großer Kanister zur Lagerung von Trinkwasser.",
      "en": "Large canister for storing drinking water."
    },
    "why": {
      "de": "Erhöht den verfügbaren Haushaltswasservorrat bei Versorgungsunterbrechung.",
      "en": "Increases the household water supply during a disruption."
    },
    "safety": {
      "de": "Nur Trinkwasser einfüllen; sauber, kühl und geschlossen lagern; regelmäßig erneuern.",
      "en": "Fill only with drinking water; store clean, cool and closed; renew regularly."
    },
    "manufacturerId": "huenersdorff",
    "model": "hünersdorff 20 L"
  },
  "notbiwaksack": {
    "name": {
      "de": "Notbiwaksack",
      "en": "Emergency bivvy bag"
    },
    "what": {
      "de": "Kompakter reflektierender Notfallschlafsack für kurzfristigen Wetterschutz.",
      "en": "Compact reflective emergency sleeping bag for short-term weather protection."
    },
    "why": {
      "de": "Reduziert Windbelastung und Wärmeverlust bis ein sicherer Schutzraum erreicht wird.",
      "en": "Reduces wind exposure and heat loss until safe shelter is reached."
    },
    "safety": {
      "de": "Nicht flammfest und kein Ersatz für isolierten Schlafsack; Atemwege freihalten und Kondensation beachten.",
      "en": "Not flameproof and no substitute for an insulated sleeping bag; keep airways clear and watch for condensation."
    },
    "manufacturerId": "chengdu"
  },
  "toilettenpapier": {
    "name": {
      "de": "Toilettenpapier",
      "en": "Toilet paper"
    },
    "what": {
      "de": "Kompakte Rolle Toilettenpapier.",
      "en": "Compact roll of toilet paper."
    },
    "why": {
      "de": "Unterstützt die Grundhygiene, wenn Einrichtungen keine Vorräte haben.",
      "en": "Supports basic hygiene when facilities have no supplies."
    },
    "safety": {
      "de": "Trocken lagern und gemäß lokalen Sanitärhinweisen entsorgen.",
      "en": "Store dry and dispose of according to local sanitation guidance."
    },
    "manufacturerId": "amazon"
  },
  "wasserfilterflasche": {
    "name": {
      "de": "Wasserfilterflasche",
      "en": "Water filter bottle"
    },
    "what": {
      "de": "Trinkflasche mit integriertem Wasserfilter.",
      "en": "Drinking bottle with integrated water filter."
    },
    "why": {
      "de": "Bietet eine zweite Möglichkeit zur Wasseraufbereitung, wenn der mitgeführte Vorrat aufgebraucht ist.",
      "en": "Offers a second way to treat water when the carried supply runs out."
    },
    "safety": {
      "de": "Nur für laut Anleitung geeignete Wasserquellen verwenden; entfernt nicht automatisch Viren, Salz oder Chemikalien.",
      "en": "Use only with water sources suitable per the instructions; does not automatically remove viruses, salt or chemicals."
    },
    "manufacturerId": "bergkvist",
    "model": "Obsidian 650 ml"
  },
  "nrg-5-notration": {
    "name": {
      "de": "NRG-5 Notration",
      "en": "NRG-5 emergency ration"
    },
    "what": {
      "de": "Kompakte, verzehrfertige Notration.",
      "en": "Compact, ready-to-eat emergency ration."
    },
    "why": {
      "de": "Liefert energiereiche Nahrung ohne Kochen und lässt sich portionieren.",
      "en": "Provides energy-dense food without cooking and can be portioned."
    },
    "safety": {
      "de": "Enthält Weizen, Gerste und Soja; mit ausreichend Wasser verzehren; Siegel und MHD prüfen.",
      "en": "Contains wheat, barley and soy; eat with enough water; check seal and best-before date."
    },
    "manufacturerId": "katadyn",
    "manufacturerText": "Katadyn Deutschland GmbH",
    "model": "500 g / 9 Riegel",
    "food": [
      {
        "legalName": {
          "de": "Komprimierte Notration",
          "en": "Compressed emergency ration"
        },
        "allergens": "Enthält WEIZEN, GERSTE und SOJA.",
        "traces": "Spurenhinweis von der aktuellen Packung kopieren.",
        "netQuantity": "500 g / 9 Riegel je Packung",
        "nutrition": {
          "energyKj": "",
          "energyKcal": "",
          "fat": "",
          "saturates": "",
          "carbohydrate": "",
          "sugars": "",
          "protein": "",
          "salt": ""
        },
        "notes": "9.600 kJ / 2.300 kcal je 500-g-Packung.",
        "storage": "Kühl und trocken in ungeöffneter Originalverpackung; MHD beachten.",
        "preparation": "Verzehrfertig, portionierbar. Mit ausreichend Trinkwasser verzehren.",
        "operator": "Katadyn Deutschland GmbH / Katadyn Group"
      }
    ]
  },
  "k-classic-langkorn-reis": {
    "name": {
      "de": "K-Classic Langkorn-Reis",
      "en": "K-Classic long-grain rice"
    },
    "what": {
      "de": "Weißer Langkornreis in Kochbeuteln.",
      "en": "White long-grain rice in boil-in bags."
    },
    "why": {
      "de": "Bietet eine lagerfähige Grundnahrung für mehrere Portionen.",
      "en": "A storable staple for several portions."
    },
    "safety": {
      "de": "Kühl und trocken lagern; in ausreichend kochendem Wasser garen.",
      "en": "Store cool and dry; cook in plenty of boiling water."
    },
    "manufacturerId": "rolryz",
    "model": "500 g",
    "food": [
      {
        "legalName": {
          "de": "Weißer Langkornreis",
          "en": "White long-grain rice"
        },
        "ingredients": "Weißer Langkornreis.",
        "netQuantity": "500 g (4 × 125 g Kochbeutel",
        "nutrition": {
          "energyKj": "1483",
          "energyKcal": "349",
          "fat": "0.7",
          "saturates": "0.2",
          "carbohydrate": "79",
          "sugars": "0.7",
          "protein": "7.2",
          "salt": "<0,01"
        },
        "notes": "Ballaststoffe <0,5 g. Werte je 100 g ungekocht.",
        "storage": "Kühl und trocken lagern. Nach dem Öffnen im verschlossenen Behälter aufbewahren.",
        "preparation": "Beutel in ausreichend kochendes Wasser geben, ca. 12–15 Minuten zugedeckt köcheln, abgießen, Beutel öffnen, servieren.",
        "origin": "Polen.",
        "operator": "Przedsiębiorstwo Rol-Ryż Sp. z o.o. (Kaufland Eigenmarke)",
        "operatorAddress": "Celna 2, 81-337 Gdynia, Polen."
      }
    ]
  },
  "k-classic-zarte-haferflocken": {
    "name": {
      "de": "K-Classic Zarte Haferflocken",
      "en": "K-Classic fine oat flakes"
    },
    "what": {
      "de": "Vollkorn-Haferflocken.",
      "en": "Wholegrain oat flakes."
    },
    "why": {
      "de": "Ermöglichen Müsli oder eine einfache warme Mahlzeit.",
      "en": "Make muesli or a simple warm meal."
    },
    "safety": {
      "de": "Enthält Hafer und Gluten; kühl und trocken lagern.",
      "en": "Contains oats and gluten; store cool and dry."
    },
    "manufacturerId": "kaufland",
    "model": "500 g",
    "food": [
      {
        "legalName": {
          "de": "Zarte Haferflocken",
          "en": "Fine oat flakes"
        },
        "ingredients": "100 % HAFER-Vollkornflocken.",
        "allergens": "Enthält HAFER/GLUTEN.",
        "traces": "von der Packung prüfen.",
        "netQuantity": "500 g",
        "nutrition": {
          "energyKj": "",
          "energyKcal": "",
          "fat": "",
          "saturates": "",
          "carbohydrate": "",
          "sugars": "",
          "protein": "",
          "salt": ""
        },
        "storage": "Kühl und trocken lagern, nach dem Öffnen verschließen.",
        "preparation": "Als Müsli oder mit Milch/Wasser zubereiten. Zubereitung laut Packung.",
        "operator": "Kaufland Eigenmarke"
      }
    ]
  },
  "corny-nussvoll": {
    "name": {
      "de": "CORNY nussvoll",
      "en": "CORNY nussvoll"
    },
    "what": {
      "de": "Portionierte Nuss- und Getreideriegel.",
      "en": "Portioned nut and cereal bars."
    },
    "why": {
      "de": "Bieten einen sofort verzehrbaren Energiesnack.",
      "en": "A ready-to-eat energy snack."
    },
    "safety": {
      "de": "Enthält Nüsse, Erdnüsse und Gluten; Allergenhinweise beachten.",
      "en": "Contains nuts, peanuts and gluten; check allergen information."
    },
    "manufacturerId": "schwartau",
    "food": [
      {
        "legalName": {
          "de": "Nuss-Getreideriegel mit Rosinen",
          "en": "Nut and cereal bar with raisins"
        },
        "allergens": "Enthält ERDNÜSSE, MANDELN und WEIZEN/GLUTEN.",
        "netQuantity": "Riegel à 24 g",
        "nutrition": {
          "energyKj": "2112",
          "energyKcal": "507",
          "fat": "31",
          "saturates": "3.2",
          "carbohydrate": "40",
          "sugars": "23",
          "protein": "",
          "salt": ""
        },
        "notes": "Ein 24-g-Riegel ≈ 122 kcal.",
        "storage": "Kühl und trocken lagern, vor Hitze schützen. MHD beachten.",
        "preparation": "Verzehrfertig. Nicht geeignet bei Allergie gegen die deklarierten Nüsse oder Getreide.",
        "operator": "Schwartauer Werke GmbH & Co. KG (CORNY)"
      }
    ]
  },
  "dr-beckmann-waschmittel-blaetter-universal": {
    "name": {
      "de": "Dr. Beckmann Waschmittel-Blätter Universal",
      "en": "Dr. Beckmann laundry sheets universal"
    },
    "what": {
      "de": "Wasserlösliche Waschmittelblätter für helle und farbechte Wäsche.",
      "en": "Water-soluble detergent sheets for whites and colourfast laundry."
    },
    "why": {
      "de": "Ermöglichen platzsparendes Waschen von Textilien bei längeren Unterbrechungen.",
      "en": "Allow space-saving washing of textiles during longer disruptions."
    },
    "safety": {
      "de": "Nur versiegelt in Originalverpackung beilegen. Gefahr: verursacht schwere Augenschäden und Hautreizungen; von Kindern fernhalten.",
      "en": "Kept sealed in original packaging. Danger: causes serious eye damage and skin irritation; keep away from children."
    },
    "manufacturerId": "delta"
  },
  "kompaktes-gewebeklebeband": {
    "name": {
      "de": "Kompaktes Gewebeklebeband",
      "en": "Compact duct tape"
    },
    "what": {
      "de": "Gewebeverstärktes Klebeband für kurzfristige Reparaturen.",
      "en": "Fabric-reinforced tape for short-term repairs."
    },
    "why": {
      "de": "Hilft beim Bündeln, Abdichten, Markieren und provisorischen Reparieren.",
      "en": "Helps bundle, seal, mark and make temporary repairs."
    },
    "safety": {
      "de": "Nicht für tragende Lasten, elektrische Isolierung, Verbandzwecke oder heiße Oberflächen verwenden.",
      "en": "Not for load-bearing, electrical insulation, dressings or hot surfaces."
    },
    "manufacturerId": "armeeimport"
  },
  "wasserabweisende-dokumentenhuelle": {
    "name": {
      "de": "Wasserabweisende Dokumentenhülle",
      "en": "Water-repellent document pouch"
    },
    "what": {
      "de": "Verschließbare Schutzhülle für Kopien wichtiger Dokumente.",
      "en": "Closable protective sleeve for copies of important documents."
    },
    "why": {
      "de": "Hält Identitäts-, Versicherungs- und Notfallunterlagen zusammen.",
      "en": "Keeps identity, insurance and emergency papers together."
    },
    "safety": {
      "de": "Verschluss vollständig schließen; nicht tauchdicht; personenbezogene Daten schützen.",
      "en": "Close fully; not submersible; protect personal data."
    },
    "manufacturerId": "tk"
  },
  "zahnbuerste": {
    "name": {
      "de": "Zahnbürste",
      "en": "Toothbrush"
    },
    "what": {
      "de": "Manuelle Zahnbürste für die persönliche Mundhygiene.",
      "en": "Manual toothbrush for personal oral hygiene."
    },
    "why": {
      "de": "Unterstützt die tägliche Hygiene bei Evakuierung oder vorübergehender Unterbringung.",
      "en": "Supports daily hygiene during evacuation or temporary accommodation."
    },
    "safety": {
      "de": "Nur persönlich verwenden, nach Gebrauch spülen und lufttrocknen.",
      "en": "Personal use only; rinse after use and air-dry."
    },
    "manufacturerId": "colgate"
  },
  "notnahrung-und-muesliriegel": {
    "name": {
      "de": "Notnahrung und Müsliriegel",
      "en": "Emergency food and cereal bars"
    },
    "what": {
      "de": "Portionierte, haltbare Energieriegel.",
      "en": "Portioned, long-life energy bars."
    },
    "why": {
      "de": "Liefert schnell verfügbare Energie bei Evakuierung, Wartezeiten oder Versorgungsunterbrechungen.",
      "en": "Provide quickly available energy during evacuation, waiting times or supply disruptions."
    },
    "safety": {
      "de": "Allergene, Verpackung und Mindesthaltbarkeitsdatum vor Gebrauch prüfen.",
      "en": "Check allergens, packaging and best-before date before use."
    },
    "manufacturerId": "schwartau",
    "food": [
      {
        "legalName": {
          "de": "Nuss-Getreideriegel mit Rosinen",
          "en": "Nut and cereal bar with raisins"
        },
        "allergens": "Enthält ERDNÜSSE, MANDELN und WEIZEN/GLUTEN.",
        "netQuantity": "Riegel à 24 g",
        "nutrition": {
          "energyKj": "2112",
          "energyKcal": "507",
          "fat": "31",
          "saturates": "3.2",
          "carbohydrate": "40",
          "sugars": "23",
          "protein": "",
          "salt": ""
        },
        "notes": "Ein 24-g-Riegel ≈ 122 kcal.",
        "storage": "Kühl und trocken lagern, vor Hitze schützen. MHD beachten.",
        "preparation": "Verzehrfertig. Nicht geeignet bei Allergie gegen die deklarierten Nüsse oder Getreide.",
        "operator": "Schwartauer Werke GmbH & Co. KG (CORNY)"
      }
    ]
  },
  "menstruationshygiene-notfallvorrat": {
    "name": {
      "de": "Menstruationshygiene-Notfallvorrat",
      "en": "Menstrual hygiene emergency supply"
    },
    "what": {
      "de": "Kurzfristiger Vorrat an einzeln verpackten Hygieneprodukten.",
      "en": "Short-term supply of individually wrapped hygiene products."
    },
    "why": {
      "de": "Deckt persönlichen Bedarf bei Evakuierung oder Lieferausfall ab.",
      "en": "Covers personal needs during evacuation or supply failure."
    },
    "safety": {
      "de": "Packungsanweisungen beachten; bei Tampons niedrigste geeignete Saugstärke und TSS-Hinweis beachten.",
      "en": "Follow pack instructions; for tampons use the lowest suitable absorbency and read the TSS notice."
    },
    "manufacturerId": "sophie"
  },
  "feuchttuecher": {
    "name": {
      "de": "Feuchttücher",
      "en": "Wet wipes"
    },
    "what": {
      "de": "Vorbefeuchtete Einwegtücher für den auf der Packung genannten Zweck.",
      "en": "Pre-moistened disposable wipes for the purpose stated on the pack."
    },
    "why": {
      "de": "Ermöglichen begrenzte Reinigung, wenn kein fließendes Wasser vorhanden ist.",
      "en": "Allow limited cleaning when no running water is available."
    },
    "safety": {
      "de": "Nicht in die Toilette werfen; Augen und verletzte Haut meiden, sofern nicht ausdrücklich erlaubt.",
      "en": "Do not flush; avoid eyes and broken skin unless expressly permitted."
    },
    "manufacturerId": "amazon"
  },
  "delverde-maccheronelli": {
    "name": {
      "de": "by Amazon Macaroni 500 g",
      "en": "by Amazon Macaroni 500 g"
    },
    "what": {
      "de": "Hartweizengrieß-Nudeln, 500 g, wiederverschließbar.",
      "en": "Durum wheat semolina pasta, 500 g, resealable."
    },
    "why": {
      "de": "Bieten eine lange lagerfähige Grundlage für warme Mahlzeiten.",
      "en": "A long-life base for warm meals."
    },
    "safety": {
      "de": "Enthält Weizen und Gluten; nur mit ausreichend Wasser und Wärme zubereiten.",
      "en": "Contains wheat and gluten; prepare only with enough water and heat."
    },
    "manufacturerId": "amazon",
    "model": "Macaroni 500 g",
    "food": [
      {
        "legalName": {
          "de": "Makkaroni aus Hartweizengrieß",
          "en": "Macaroni made from durum wheat semolina"
        },
        "ingredients": "Hartweizengrieß, Wasser.",
        "allergens": "Enthält WEIZEN/GLUTEN.",
        "netQuantity": "500 g",
        "nutrition": {
          "energyKj": "",
          "energyKcal": "",
          "fat": "",
          "saturates": "",
          "carbohydrate": "",
          "sugars": "",
          "protein": "",
          "salt": ""
        },
        "storage": "Trocken und vor Hitze geschützt lagern.",
        "preparation": "In kochendem Wasser nach der auf der Packung angegebenen Zeit garen (ca. 7 Min.).",
        "origin": "Hergestellt in Italien aus Hartweizen aus EU- und Nicht-EU-Ländern.",
        "operator": "Amazon EU S.à r.l.",
        "operatorAddress": "38 Avenue John F. Kennedy, L-1855 Luxemburg"
      }
    ]
  },
  "amazon-basics-15-in-1-multifunktionswerkzeug": {
    "name": {
      "de": "Amazon Basics 15-in-1-Multifunktionswerkzeug",
      "en": "Amazon Basics 15-in-1 multitool"
    },
    "what": {
      "de": "Faltbares Werkzeug mit Messer, Säge, Schere und weiteren Funktionen.",
      "en": "Folding tool with knife, saw, scissors and more."
    },
    "why": {
      "de": "Unterstützt Öffnen, Schneiden und kleine Reparaturen unterwegs.",
      "en": "Helps with opening, cutting and small repairs on the move."
    },
    "safety": {
      "de": "Scharfe Werkzeuge vorsichtig verwenden, vom Körper weg schneiden und von Kindern fernhalten.",
      "en": "Use sharp tools carefully, cut away from the body and keep away from children."
    },
    "manufacturerId": "amazon",
    "manufacturerText": "Amazon EU S.à r.l., 38 Avenue John F. Kennedy, L-1855 Luxemburg",
    "model": "DS-MFAMZ017",
    "ageRestricted": true
  },
  "amazon-basics-reise-naehset": {
    "name": {
      "de": "Amazon Basics Reise-Nähset",
      "en": "Amazon Basics travel sewing kit"
    },
    "what": {
      "de": "Etui mit Garn, Nadeln, Schere, Knöpfen und Reparaturzubehör.",
      "en": "Case with thread, needles, scissors, buttons and repair accessories."
    },
    "why": {
      "de": "Repariert Kleidung, Gurte und Stoff, wenn Ersatz nicht verfügbar ist.",
      "en": "Repairs clothing, straps and fabric when replacements are unavailable."
    },
    "safety": {
      "de": "Enthält scharfe Teile; von Kindern fernhalten und alle Nadeln nach Gebrauch sicher verstauen.",
      "en": "Contains sharp parts; keep away from children and stow all needles safely after use."
    },
    "manufacturerId": "amazon",
    "model": "AQSSK2001"
  },
  "notfall-checkliste": {
    "name": {
      "de": "Notfall-Checkliste",
      "en": "Emergency checklist"
    },
    "what": {
      "de": "Gedruckte Kurzanleitung für Vorbereitung und Evakuierung.",
      "en": "Printed quick guide for preparation and evacuation."
    },
    "why": {
      "de": "Hilft, unter Stress wichtige Schritte und Ausrüstung nicht zu vergessen.",
      "en": "Helps you not forget key steps and equipment under stress."
    },
    "safety": {
      "de": "Aktuelle Behördenhinweise haben Vorrang; ersetzt keine Anweisung der Rettungsdienste.",
      "en": "Current official guidance takes priority; does not replace instructions from emergency services."
    },
    "manufacturerId": "tk",
    "manufacturerText": "T-KONTROL Resilience Solutions UG"
  },
  "regenjacke": {
    "name": {
      "de": "Regenjacke",
      "en": "Rain jacket"
    },
    "what": {
      "de": "Leichte, kompakt verpackbare Jacke gegen Wind und Regen.",
      "en": "Lightweight jacket that packs small, against wind and rain."
    },
    "why": {
      "de": "Hilft, bei Evakuierung und Wartezeiten trocken und wärmer zu bleiben.",
      "en": "Helps you stay dry and warmer during evacuation and waiting."
    },
    "safety": {
      "de": "Passende Größe wählen; von Feuer fernhalten und im Straßenverkehr auf Sichtbarkeit achten.",
      "en": "Choose the right size; keep away from fire and stay visible near traffic."
    },
    "manufacturerId": "flintronic"
  },
  "puzzle-oder-puzzlematte": {
    "name": {
      "de": "Puzzle oder Puzzlematte",
      "en": "Puzzle or puzzle mat"
    },
    "what": {
      "de": "Ruhige Beschäftigung für längere Wartezeiten.",
      "en": "Quiet activity for longer waiting times."
    },
    "why": {
      "de": "Unterstützt Konzentration und strukturierte Pausen bei langanhaltender Unterbrechung.",
      "en": "Supports concentration and structured breaks during long disruptions."
    },
    "safety": {
      "de": "Altersangabe und Kleinteilehinweis beachten; trocken und vollständig lagern.",
      "en": "Observe age and small-parts warnings; store dry and complete."
    },
    "manufacturerId": "clementoni"
  },
  "erasco-fertiggerichte": {
    "name": {
      "de": "Erasco Fertiggerichte",
      "en": "Erasco ready meals"
    },
    "what": {
      "de": "Haltbare Suppen und Eintöpfe in der Dose.",
      "en": "Long-life canned soups and stews."
    },
    "why": {
      "de": "Bieten mehrere schnell erwärmbare Mahlzeiten.",
      "en": "Several meals that heat up quickly."
    },
    "safety": {
      "de": "Allergene je Dose beachten; ungeöffnete Dose nicht erhitzen; Reste kühlen.",
      "en": "Check allergens on each can; never heat an unopened can; refrigerate leftovers."
    },
    "manufacturerId": "gbfoods",
    "manufacturerText": "GB Foods Deutschland GmbH, Geniner Straße 88-100, 23560 Lübeck",
    "food": [
      {
        "legalName": {
          "de": "Linsen-Eintopf mit Würstchen",
          "en": "Lentil stew with sausages"
        },
        "allergens": "Enthält SENF.",
        "netQuantity": "400 g",
        "nutrition": {
          "energyKj": "",
          "energyKcal": "",
          "fat": "",
          "saturates": "",
          "carbohydrate": "",
          "sugars": "",
          "protein": "",
          "salt": ""
        },
        "storage": "Ungeöffnet wie angegeben lagern. Reste kühlen und rasch verbrauchen.",
        "preparation": "Nach Dosenanweisung gut erhitzen. Ungeöffnete Dose NICHT erhitzen.",
        "operator": "GB Foods Deutschland GmbH",
        "operatorAddress": "Geniner Straße 88–100, 23560 Lübeck, Deutschland."
      },
      {
        "legalName": {
          "de": "Hühner-Nudelsuppe",
          "en": "Chicken noodle soup"
        },
        "allergens": "Voraussichtlich WEIZEN/GLUTEN und EI über die Nudeln ersetzt NICHT die exakte fett gedruckte Allergendeklaration auf der Dose.",
        "netQuantity": "390 ml",
        "nutrition": {
          "energyKj": "130",
          "energyKcal": "31",
          "fat": "",
          "saturates": "",
          "carbohydrate": "",
          "sugars": "",
          "protein": "",
          "salt": ""
        },
        "notes": "Werte je 100 ml.",
        "storage": "Ungeöffnet wie angegeben lagern. Reste kühlen und rasch verbrauchen.",
        "preparation": "Nach Dosenanweisung gut erhitzen. Ungeöffnete Dose NICHT erhitzen.",
        "operator": "GB Foods Deutschland GmbH",
        "operatorAddress": "Geniner Straße 88–100, 23560 Lübeck, Deutschland."
      }
    ]
  },
  "wasa-vollkorn-roggen": {
    "name": {
      "de": "Wasa Vollkorn Roggen",
      "en": "Wasa wholegrain rye"
    },
    "what": {
      "de": "Haltbares Vollkorn-Roggenknäckebrot.",
      "en": "Long-life wholegrain rye crispbread."
    },
    "why": {
      "de": "Dient als lagerfähiger Brotersatz ohne Kochen.",
      "en": "A storable bread substitute that needs no cooking."
    },
    "safety": {
      "de": "Enthält Roggen und Gluten; trocken lagern und Allergenhinweise beachten.",
      "en": "Contains rye and gluten; store dry and observe allergen information."
    },
    "manufacturerId": "barilla",
    "manufacturerText": "Wasa Barilla Gruppe",
    "food": [
      {
        "legalName": {
          "de": "Vollkorn-Roggenknäckebrot",
          "en": "Wholegrain rye crispbread"
        },
        "ingredients": "VOLLKORN-ROGGENmehl 105 g je 100 g Produkt, Hefe, Salz.",
        "allergens": "Enthält ROGGEN/GLUTEN.",
        "traces": "Kann Spuren von LUPINEN, MILCH, SENF, SESAM und SOJA enthalten.",
        "netQuantity": "ca. 270 g",
        "nutrition": {
          "energyKj": "1390",
          "energyKcal": "330",
          "fat": "2.0",
          "saturates": "0.4",
          "carbohydrate": "58",
          "sugars": "1.5",
          "protein": "10",
          "salt": "1.2"
        },
        "notes": "Ballaststoffe 20 g.",
        "storage": "Trocken lagern, nach dem Öffnen wieder verschließen und vor Feuchtigkeit schützen.",
        "preparation": "Verzehrfertig. Haltbarer Brotersatz.",
        "operator": "Wasa / Barilla-Gruppe"
      }
    ]
  },
  "amazon-basics-geflochtenes-baumwollseil": {
    "name": {
      "de": "Amazon Basics geflochtenes Baumwollseil",
      "en": "Amazon Basics braided cotton rope"
    },
    "what": {
      "de": "Baumwollummanteltes Mehrzweckseil mit synthetischem Kern.",
      "en": "Cotton-sheathed multi-purpose rope with synthetic core."
    },
    "why": {
      "de": "Dient als Wäscheleine, zum Ordnen und für leichte provisorische Befestigungen.",
      "en": "Serves as a clothesline, for organising and light temporary fastening."
    },
    "safety": {
      "de": "Nicht zum Klettern, Retten, Heben, Abschleppen oder Sichern von Personen verwenden.",
      "en": "Not for climbing, rescue, lifting, towing or securing people."
    },
    "manufacturerId": "amazon",
    "model": "AB415CSCHN"
  },
  "bosch-multifunktionswerkzeug": {
    "name": {
      "de": "Bosch Multifunktionswerkzeug",
      "en": "Bosch multitool"
    },
    "what": {
      "de": "Faltbares Werkzeug mit Messer, Säge, Schere und weiteren Funktionen.",
      "en": "Folding tool with knife, saw, scissors and more."
    },
    "why": {
      "de": "Unterstützt Öffnen, Schneiden und kleine Reparaturen unterwegs.",
      "en": "Helps with opening, cutting and small repairs on the move."
    },
    "safety": {
      "de": "Scharfe Werkzeuge vorsichtig verwenden, vom Körper weg schneiden und von Kindern fernhalten.",
      "en": "Use sharp tools carefully, cut away from the body and keep away from children."
    },
    "manufacturerId": "bosch",
    "ageRestricted": true
  },
  "pakomat-druckverschlussbeutel": {
    "name": {
      "de": "Pakomat Druckverschlussbeutel",
      "en": "Pakomat zip bags"
    },
    "what": {
      "de": "Transparente wiederverschließbare PE-Beutel, 8 x 12 cm.",
      "en": "Transparent resealable PE bags, 8 × 12 cm."
    },
    "why": {
      "de": "Trennen nasse, schmutzige oder kleine Gegenstände und schaffen Ordnung im Rucksack.",
      "en": "Separate wet, dirty or small items and keep the backpack organised."
    },
    "safety": {
      "de": "Erstickungsgefahr; von Kindern fernhalten; nicht erhitzen oder in der Mikrowelle verwenden.",
      "en": "Suffocation hazard; keep away from children; do not heat or microwave."
    },
    "manufacturerId": "pakomat"
  },
  "mehrzweck-karabiner": {
    "name": {
      "de": "Mehrzweck-Karabiner",
      "en": "Multi-purpose carabiners"
    },
    "what": {
      "de": "Kleine Schnapphaken für leichte Ausrüstung.",
      "en": "Small snap hooks for light equipment."
    },
    "why": {
      "de": "Befestigen Schlüssel, Flaschen und Zubehör am Rucksack.",
      "en": "Attach keys, bottles and accessories to the backpack."
    },
    "safety": {
      "de": "Nicht für Klettern, Absturzsicherung, Rettung oder Überkopflasten verwenden.",
      "en": "Not for climbing, fall arrest, rescue or overhead loads."
    },
    "manufacturerId": "jinhua"
  },
  "kabelbinder": {
    "name": {
      "de": "Kabelbinder",
      "en": "Cable ties"
    },
    "what": {
      "de": "Schwere Nylon-Kabelbinder zur Bündelung und provisorischen Befestigung.",
      "en": "Heavy-duty nylon ties for bundling and temporary fastening."
    },
    "why": {
      "de": "Ordnen Kabel und ermöglichen schnelle nichttragende Reparaturen.",
      "en": "Organise cables and allow quick non-load-bearing repairs."
    },
    "safety": {
      "de": "Nie an Menschen oder Tieren anwenden; nicht für Hebe- oder Sicherheitslasten verwenden.",
      "en": "Never use on people or animals; not for lifting or safety loads."
    },
    "manufacturerId": "xdh"
  },
  "notfall-und-evakuierungs-qr-karte": {
    "name": {
      "de": "Notfall- und Evakuierungs-QR-Karte",
      "en": "Emergency and evacuation QR card"
    },
    "what": {
      "de": "Karte mit Link zu gepflegten digitalen Notfallinformationen.",
      "en": "Card linking to maintained digital emergency information."
    },
    "why": {
      "de": "Ermöglicht schnellen Zugriff auf weiterführende Hinweise und Aktualisierungen.",
      "en": "Gives fast access to further guidance and updates."
    },
    "safety": {
      "de": "QR-Code regelmäßig testen; wesentliche Sicherheitshinweise nicht ausschließlich digital bereitstellen.",
      "en": "Test the QR code regularly; essential safety information is not provided digitally only."
    },
    "manufacturerId": "tk",
    "manufacturerText": "T-KONTROL Resilience Solutions UG"
  },
  "wasserabweisender-notfallrucksack-45-10-l": {
    "name": {
      "de": "Wasserabweisender Notfallrucksack 45 + 10 L",
      "en": "Water-repellent emergency backpack 45 + 10 L"
    },
    "what": {
      "de": "Großer, erweiterbarer Rucksack für die gesamte Notfallausrüstung.",
      "en": "Large, expandable backpack for all emergency equipment."
    },
    "why": {
      "de": "Hält die Ausrüstung geordnet und bei einer schnellen Evakuierung transportbereit.",
      "en": "Keeps equipment organised and ready to carry for a rapid evacuation."
    },
    "safety": {
      "de": "Gewicht gleichmäßig verteilen; Nähte, Gurte und Verschlüsse prüfen; nicht tauchdicht.",
      "en": "Distribute weight evenly; check seams, straps and buckles; not submersible."
    },
    "manufacturerId": "tk",
    "manufacturerText": "T-KONTROL Lieferprodukt",
    "model": "45 + 10 L"
  },
  "corny-nussvoll-nuss-und-traube": {
    "name": {
      "de": "CORNY nussvoll Nuss und Traube",
      "en": "CORNY nussvoll nut & raisin"
    },
    "what": {
      "de": "Portionierte Nuss-, Rosinen- und Getreideriegel.",
      "en": "Portioned nut, raisin and cereal bars."
    },
    "why": {
      "de": "Bieten einen vertrauten, schnell verfügbaren Energiesnack.",
      "en": "A familiar, quickly available energy snack."
    },
    "safety": {
      "de": "Enthält Erdnüsse, Mandeln und glutenhaltiges Getreide; aktuelle Allergenhinweise beachten.",
      "en": "Contains peanuts, almonds and gluten-containing cereals; check current allergen information."
    },
    "manufacturerId": "schwartau",
    "food": [
      {
        "legalName": {
          "de": "Nuss-Getreideriegel mit Rosinen",
          "en": "Nut and cereal bar with raisins"
        },
        "allergens": "Enthält ERDNÜSSE, MANDELN und WEIZEN/GLUTEN.",
        "netQuantity": "Riegel à 24 g",
        "nutrition": {
          "energyKj": "2112",
          "energyKcal": "507",
          "fat": "31",
          "saturates": "3.2",
          "carbohydrate": "40",
          "sugars": "23",
          "protein": "",
          "salt": ""
        },
        "notes": "Ein 24-g-Riegel ≈ 122 kcal.",
        "storage": "Kühl und trocken lagern, vor Hitze schützen. MHD beachten.",
        "preparation": "Verzehrfertig. Nicht geeignet bei Allergie gegen die deklarierten Nüsse oder Getreide.",
        "operator": "Schwartauer Werke GmbH & Co. KG (CORNY)"
      }
    ]
  },
  "wiederaufladbarer-mini-ventilator": {
    "name": {
      "de": "Wiederaufladbarer Mini-Ventilator",
      "en": "Rechargeable mini fan"
    },
    "what": {
      "de": "Kompakter akkubetriebener Ventilator.",
      "en": "Compact battery-powered fan."
    },
    "why": {
      "de": "Verbessert Komfort bei Hitze oder in überfüllten Notunterkünften.",
      "en": "Improves comfort in heat or crowded emergency shelters."
    },
    "safety": {
      "de": "Finger, Haare und Textilien vom Gitter fernhalten; Akku bei Beschädigung nicht laden.",
      "en": "Keep fingers, hair and fabric away from the guard; do not charge a damaged battery."
    },
    "manufacturerId": "wuhan",
    "model": "GBDFS-1630",
    "registration": {
      "weee": "DE 42700827",
      "battery": "DE 31007430",
      "registeredVia": "BellaCocool GmbH für wuhanjunxiaoyishangmaoyouxiangongsi"
    }
  },
  "teelichter-oder-kerzen": {
    "name": {
      "de": "Teelichter oder Kerzen",
      "en": "Tea lights or candles"
    },
    "what": {
      "de": "Kerzenlicht für kurzfristige Beleuchtung.",
      "en": "Candlelight for short-term lighting."
    },
    "why": {
      "de": "Bietet eine einfache Lichtquelle bei Stromausfall.",
      "en": "A simple light source during a power cut."
    },
    "safety": {
      "de": "Nie unbeaufsichtigt brennen lassen; Abstand zu Kindern, Textilien und brennbaren Materialien halten.",
      "en": "Never leave burning unattended; keep away from children, fabrics and flammable materials."
    },
    "manufacturerId": "bolsius"
  },
  "addtop-solar-powerbank": {
    "name": {
      "de": "ADDTOP Solar-Powerbank",
      "en": "ADDTOP solar power bank"
    },
    "what": {
      "de": "Tragbare 20000 mAh Powerbank mit vier faltbaren Solarpanels und USB-Anschlüssen.",
      "en": "Portable 20,000 mAh power bank with four folding solar panels and USB ports."
    },
    "why": {
      "de": "Versorgt Telefon und kleine USB-Geräte bei Stromausfall oder unterwegs.",
      "en": "Powers a phone and small USB devices during a power cut or on the move."
    },
    "safety": {
      "de": "Vor Einlagerung laden und regelmäßig prüfen; trocken halten; bei Aufblähung oder Beschädigung nicht verwenden.",
      "en": "Charge before storage and check regularly; keep dry; do not use if swollen or damaged."
    },
    "manufacturerId": "addtop",
    "manufacturerText": "Yuwei Technology Dongguan Co Ltd; EU Kontakt C E Connection E Commerce DE GmbH, Zum Linnegraben 20, 65933 Frankfurt; info@ce-connection.de",
    "model": "A ADDTOP HI-S225P · 20.000 mAh",
    "registration": {
      "weee": "DE 89633988",
      "battery": "DE 91566411",
      "registeredVia": "Amazon EU S.à r.l., Niederlassung Deutschland"
    }
  },
  "iniu-powerbank-usb-c-10-000-mah": {
    "name": {
      "de": "INIU Powerbank USB-C 10.000 mAh",
      "en": "INIU power bank USB-C 10,000 mAh"
    },
    "what": {
      "de": "Kompakte tragbare USB-C-Energiequelle.",
      "en": "Compact portable USB-C power source."
    },
    "why": {
      "de": "Hält Mobiltelefon und kleine USB-Geräte bei Stromausfall betriebsbereit.",
      "en": "Keeps a mobile phone and small USB devices working during a power cut."
    },
    "safety": {
      "de": "Trocken lagern; nicht quetschen, durchstechen, überhitzen oder bei Beschädigung verwenden.",
      "en": "Store dry; do not crush, puncture, overheat or use if damaged."
    },
    "manufacturerId": "topstar",
    "model": "INIU BI-B41",
    "registration": {
      "weee": "DE 89633988",
      "battery": "DE 91566411",
      "registeredVia": "Amazon EU S.à r.l., Niederlassung Deutschland"
    }
  },
  "permanentmarker": {
    "name": {
      "de": "Permanentmarker",
      "en": "Permanent marker"
    },
    "what": {
      "de": "Wasserfester Marker für viele Oberflächen.",
      "en": "Waterproof marker for many surfaces."
    },
    "why": {
      "de": "Beschriftet Beutel, Behälter und sichtbare Hinweise.",
      "en": "Labels bags, containers and visible notices."
    },
    "safety": {
      "de": "Mit Belüftung verwenden; von Kindern, Augen, Haut, Lebensmitteln und Feuer fernhalten.",
      "en": "Use with ventilation; keep away from children, eyes, skin, food and fire."
    },
    "manufacturerId": "edding",
    "model": "edding 300"
  },
  "wiederaufladbare-aaa-batterien": {
    "name": {
      "de": "Wiederaufladbare AAA-Batterien",
      "en": "Rechargeable AAA batteries"
    },
    "what": {
      "de": "Wiederaufladbare AAA-Zellen für kompatible Geräte.",
      "en": "Rechargeable AAA cells for compatible devices."
    },
    "why": {
      "de": "Bieten wiederverwendbare Reserveenergie.",
      "en": "Provide reusable reserve power."
    },
    "safety": {
      "de": "Nur mit geeignetem Ladegerät laden; Polarität beachten und keine unterschiedlichen Zelltypen mischen.",
      "en": "Charge only with a suitable charger; observe polarity and do not mix cell types."
    },
    "manufacturerId": "amazon",
    "model": "Amazon Basics AAA"
  },
  "kohlenmonoxid-melder": {
    "name": {
      "de": "Kohlenmonoxid-Melder",
      "en": "Carbon monoxide detector"
    },
    "what": {
      "de": "Elektronischer Warnmelder für Kohlenmonoxid.",
      "en": "Electronic alarm for carbon monoxide."
    },
    "why": {
      "de": "Warnt vor gefährlichem CO bei der Nutzung von Verbrennungsgeräten.",
      "en": "Warns of dangerous CO when using combustion appliances."
    },
    "safety": {
      "de": "Nur gemäß Anleitung installieren; regelmäßig testen; ersetzt weder Belüftung noch sichere Gerätenutzung.",
      "en": "Install only as instructed; test regularly; does not replace ventilation or safe appliance use."
    },
    "manufacturerId": "xsense",
    "model": "X-Sense XC0C-SR",
    "registration": {
      "weee": "DE 75316824",
      "registeredVia": "ECOPV-EU GmbH für X-Sense Europe B.V."
    }
  },
  "handkurbel-und-solar-notfalllampe": {
    "name": {
      "de": "Handkurbel- und Solar-Notfalllampe",
      "en": "Hand-crank and solar emergency lamp"
    },
    "what": {
      "de": "LED-Lampe mit Handkurbel- und Solar-Lademöglichkeit.",
      "en": "LED lamp with hand-crank and solar charging."
    },
    "why": {
      "de": "Bietet Licht, wenn Batterien und Netzstrom fehlen.",
      "en": "Gives light when batteries and mains power are unavailable."
    },
    "safety": {
      "de": "Regelmäßig testen; Solarleistung ist wetterabhängig; Karabinerform nicht zum Klettern verwenden.",
      "en": "Test regularly; solar output depends on weather; the carabiner shape is not for climbing."
    },
    "manufacturerId": "simpeak",
    "model": "S19",
    "registration": {
      "weee": "DE 44827323",
      "battery": "DE 91766716",
      "registeredVia": "BellaCocool GmbH für KIRIN TECHNOLOGY CO., LIMITED"
    }
  },
  "nitril-einweghandschuhe": {
    "name": {
      "de": "Nitril-Einweghandschuhe",
      "en": "Nitrile disposable gloves"
    },
    "what": {
      "de": "Einmalhandschuhe als kurzfristige Hygienebarriere.",
      "en": "Single-use gloves as a short-term hygiene barrier."
    },
    "why": {
      "de": "Unterstützen Erste Hilfe und schmutzige Arbeiten.",
      "en": "Support first aid and dirty work."
    },
    "safety": {
      "de": "Nur einmal verwenden; bei Riss wechseln; kein Schutz vor Nadelstichen und nicht gegen jede Chemikalie.",
      "en": "Single use only; change if torn; no protection against needlesticks or every chemical."
    },
    "manufacturerId": "arnomed"
  },
  "abus-loeschdecke": {
    "name": {
      "de": "ABUS Löschdecke",
      "en": "ABUS fire blanket"
    },
    "what": {
      "de": "Feuerlöschdecke zum Ersticken eines kleinen Entstehungsbrandes.",
      "en": "Fire blanket for smothering a small starting fire."
    },
    "why": {
      "de": "Kann einen kleinen Pfannen- oder Kleidungsbrand eindämmen, solange ein Fluchtweg frei bleibt.",
      "en": "Can contain a small pan or clothing fire while an escape route stays open."
    },
    "safety": {
      "de": "Notruf absetzen und Evakuierung priorisieren; nie Wasser auf brennendes Fett geben; nach Einsatz ersetzen.",
      "en": "Call emergency services and prioritise evacuation; never pour water on burning fat; replace after use."
    },
    "manufacturerId": "petex",
    "model": "AFS625",
    "includedIn": {
      "de": "Im PETEX Erste-Hilfe-Set enthalten — keine separate Verpackung.",
      "en": "Supplied inside the PETEX first-aid kit — no separate packaging."
    }
  },
  "zahnpasta": {
    "name": {
      "de": "Zahnpasta",
      "en": "Toothpaste"
    },
    "what": {
      "de": "Kleine Tube Zahnpasta.",
      "en": "Small tube of toothpaste."
    },
    "why": {
      "de": "Unterstützt die Mundhygiene, wenn normale Routinen unterbrochen sind.",
      "en": "Supports oral hygiene when normal routines are disrupted."
    },
    "safety": {
      "de": "Nach Packungsangabe verwenden, nicht schlucken und bei Kindern Fluoridhinweise beachten.",
      "en": "Use as directed, do not swallow, observe fluoride guidance for children."
    },
    "manufacturerId": "haleon"
  },
  "kompaktes-mikrofasertuch": {
    "name": {
      "de": "Kompaktes Mikrofasertuch",
      "en": "Compact microfibre towel"
    },
    "what": {
      "de": "Schnelltrocknendes kleines Reisehandtuch.",
      "en": "Quick-drying small travel towel."
    },
    "why": {
      "de": "Unterstützt Waschen, Trocknen und allgemeine Hygiene bei geringem Packmaß.",
      "en": "Supports washing, drying and general hygiene with small pack size."
    },
    "safety": {
      "de": "Vor erster Nutzung waschen, vollständig trocknen und von Flammen fernhalten.",
      "en": "Wash before first use, dry fully and keep away from flames."
    },
    "manufacturerId": "fitflip"
  },
  "schutzbrille": {
    "name": {
      "de": "Schutzbrille",
      "en": "Safety goggles"
    },
    "what": {
      "de": "Schutzbrille gegen die gemäß Kennzeichnung abgedeckten Gefahren.",
      "en": "Goggles against the hazards covered by their marking."
    },
    "why": {
      "de": "Reduziert Augenverletzungen bei Aufräum- und Reparaturarbeiten.",
      "en": "Reduce eye injuries during clean-up and repair work."
    },
    "safety": {
      "de": "Nur für die ausgewiesene Schutzklasse verwenden; zerkratzte oder beschädigte Brille ersetzen.",
      "en": "Use only for the stated protection class; replace if scratched or damaged."
    },
    "manufacturerId": "uvex",
    "model": "pheos nxt"
  },
  "notizbuch": {
    "name": {
      "de": "Notizbuch",
      "en": "Notebook"
    },
    "what": {
      "de": "Kompaktes Papierheft für handschriftliche Aufzeichnungen.",
      "en": "Compact paper notebook for handwritten notes."
    },
    "why": {
      "de": "Bewahrt Kontakte, Routen, Medikamente und Aufgaben offline auf.",
      "en": "Keeps contacts, routes, medication and tasks available offline."
    },
    "safety": {
      "de": "Trocken lagern und sensible personenbezogene Daten schützen.",
      "en": "Store dry and protect sensitive personal data."
    },
    "manufacturerId": "brunnen"
  }
};

export const MANUFACTURERS = {
  "tpvision": {
    "name": "TP Vision Europe B.V. (Philips)",
    "address": "Prins Bernhardplein 200, 1097 JB Amsterdam, Niederlande",
    "contact": "tv-sound-monitors.philips.com/s/contactsupport"
  },
  "delta": {
    "name": "delta pronatura GmbH",
    "address": "Kurt-Schumacher-Ring 15–17, 63329 Egelsbach, Deutschland",
    "contact": "+49 6103 40450 · www.delta-pronatura.de",
    "euRep": "Dr. Beckmann Group GmbH, Kurt-Schumacher-Ring 15–17, 63329 Egelsbach · ecommerce@drbeckmanngroup.com"
  },
  "pakomat": {
    "name": "pakomat.pl Jakub Śmiechowski",
    "address": "Przemysłowa 2, 10-418 Olsztyn, Polen",
    "contact": "sklep@pakomat.pl"
  },
  "gbfoods": {
    "name": "GB Foods Deutschland GmbH",
    "address": "Geniner Straße 88–100, 23560 Lübeck, Deutschland"
  },
  "tsp": {
    "name": "The Sustainable People GmbH",
    "address": "Eilbeker Weg 66, 22089 Hamburg, Deutschland",
    "contact": "info@thesustainablepeople.com"
  },
  "clementoni": {
    "name": "Clementoni S.p.A.",
    "address": "Zona Industriale Fontenoce, 62019 Recanati, Italien",
    "contact": "de.clementoni.com"
  },
  "jinhua": {
    "name": "Jinhua Luchuang Dianzi Shangwu Youxian Gongsi",
    "address": "Jindongqu Guangnanlu 169, Wandaguangchang 9, 2507, Jinhua, China",
    "euRep": "Apex CE Specialists GmbH, Grafenberger Allee 277, 40237 Düsseldorf"
  },
  "anker": {
    "name": "Anker Innovations Limited",
    "address": "Unit 56, 8th Floor, Tower 2, Admiralty Centre, 18 Harcourt Road, Hongkong",
    "contact": "support@anker.com",
    "euRep": "Anker Innovations Deutschland GmbH, Georg-Muche-Straße 3, 80807 München · ankerdirect@oceanwing.com"
  },
  "bergkvist": {
    "name": "Mission Green Ltd. (BERGKVIST)",
    "address": "1 Apriliou 47, 3117 Limassol, Zypern",
    "contact": "support@missiongreen.eu"
  },
  "sophie": {
    "name": "Sophie"
  },
  "flintronic": {
    "name": "SHENZHEN BAMALE DIANZI SHANGWU YOUXIAN GONGSI (flintronic)",
    "address": "No.101 Lingben B1 Dong Changfang, No.3 Longshangongyequ, Nanlingcunshequ, Nanwanjiedao, Longgang District, Shenzhen, Guangdong, CN 518114",
    "contact": "flineu@qq.com",
    "euRep": "TACOMA Sp. z o.o., Grzybowska 2 lok. 29, 00-131 Warszawa, Polen · info@tacoma-rep.eu"
  },
  "brunnen": {
    "name": "Baier & Schneider GmbH & Co. KG (BRUNNEN)",
    "address": "Wollhausstraße 62, 74072 Heilbronn, Deutschland",
    "contact": "+49 7131 8860 · info@brunnen.de"
  },
  "barilla": {
    "name": "Wasa / Barilla-Gruppe"
  },
  "bosch": {
    "name": "Robert Bosch Power Tools GmbH",
    "address": "Max-Lang-Straße 40–46, 70771 Leinfelden-Echterdingen, Deutschland",
    "contact": "www.bosch-professional.com"
  },
  "xsense": {
    "name": "X-Sense Innovations Co., Ltd.",
    "address": "B4-503, Kexing Science Park, 15 Keyuan Road, Shenzhen 518057, China",
    "contact": "support@x-sense.com",
    "euRep": "ECOPV-EU GmbH für X-Sense Europe B.V."
  },
  "decathlon": {
    "name": "DECATHLON Deutschland SE & Co. KG",
    "address": "Filsallee 19, 73207 Plochingen, Deutschland",
    "contact": "service@decathlon.de"
  },
  "huenersdorff": {
    "name": "hünersdorff GmbH Kunststoffverarbeitung",
    "address": "Eisenbahnstraße 6, 71636 Ludwigsburg, Deutschland",
    "contact": "info@huenersdorff.de · www.huenersdorff.de"
  },
  "netto": {
    "name": "Netto Marken-Discount Stiftung & Co. KG",
    "address": "Industriepark Ponholz 1, 93142 Maxhütte-Haidhof, Deutschland"
  },
  "buff": {
    "name": "ORIGINAL BUFF, S.A.",
    "address": "C/ França 16, 08700 Igualada, Barcelona, Spanien",
    "contact": "www.buff.com"
  },
  "chengdu": {
    "name": "ChengDu ChaoYiTi MaoYi YouXian GongSi",
    "address": "JinJiangQu LiHuaJie 9, ChengDu, Sichuan, China",
    "euRep": "Juan Serrano Gonzalez Sociedad Limitada, C/ Pablo Iglesias 1-A, Spanien"
  },
  "seven": {
    "name": "Compact Food Solutions AS (Seven OceanS)",
    "address": "Smoget 29, 5212 Søfteland, Norwegen",
    "euRep": "Vertrieb EU: Saveurs & Logistique / Lyophilise & Co, Pôle Course au Large, 6bis rue du Sous-Marin Venus, 56100 Lorient, Frankreich"
  },
  "amazon": {
    "name": "Amazon EU S.à r.l.",
    "address": "38 Avenue John F. Kennedy, L-1855 Luxemburg",
    "contact": "amazon.com/pbhelp"
  },
  "simpeak": {
    "name": "SIMPEAK TECHNOLOGY CO., LIMITED",
    "address": "706 Prince Edward Road East, San Po Kong, Kowloon, Hongkong",
    "euRep": "E-CrossStu GmbH, Mainzer Landstraße 69, 60329 Frankfurt am Main · E-CrossStu@web.de"
  },
  "edding": {
    "name": "edding Vertrieb GmbH",
    "address": "An der Feldmark 9b, 31515 Wunstorf, Deutschland",
    "contact": "+49 5031 1500 · info@edding-vertrieb.de"
  },
  "schneider": {
    "name": "Schneider Schreibgeräte GmbH",
    "address": "Schwarzenbach 9, 78144 Schramberg, Deutschland",
    "contact": "www.schneiderpen.de",
    "euRep": "ABN Systems International SA, Marinarilor Street No. 29, First District, 013946 Bukarest, Rumänien · maria.sandu@abnsystems.ro"
  },
  "armeeimport": {
    "name": "Armeeimport Thomas Liebold",
    "address": "Heinrich-Heine-Straße 16, 07937 Zeulenroda-Triebes, Deutschland",
    "contact": "armeeimport@gmx.de"
  },
  "addtop": {
    "name": "Yuwei Technology (Dongguan) Co., Ltd.",
    "address": "Dongguan, China",
    "euRep": "C&E Connection E-Commerce (DE) GmbH, Zum Linnegraben"
  },
  "wuhan": {
    "name": "wuhanjunxiaoyishangmaoyouxiangongsi",
    "address": "Jianghanqu Tangjiadunchengzhongcun Zonghegaizaoxiangmu K3 Dikuai 5 Zhuang 45 Ceng 2 Hao, Wuhan, Hubei, China",
    "euRep": "OASIS SERVICE Sp. z o.o., ul. Młynarska 42, lok. 115, 01-171 Warschau, Polen · +48 22 300 19 62 · oasisservicepl@outlook.com"
  },
  "uvex": {
    "name": "uvex Arbeitsschutz GmbH",
    "address": "Würzburger Straße 181–189, 90766 Fürth, Deutschland"
  },
  "freytag": {
    "name": "Freytag-Berndt und Artaria KG",
    "address": "Wien, Österreich"
  },
  "arnomed": {
    "name": "ARNOWA GmbH",
    "address": "Haltiger Feld 13, 33154 Salzkotten, Deutschland",
    "contact": "amz@arnowa.de"
  },
  "haleon": {
    "name": "GlaxoSmithKline Santé Grand Public",
    "address": "23 rue François Jacob, 92565 Rueil-Malmaison Cedex, Frankreich",
    "contact": "haleon.com",
    "euRep": "Haleon Germany GmbH, Barthstraße 4, 80339 München"
  },
  "bolsius": {
    "name": "Bolsius Nederland BV",
    "address": "Postbus 109, 5480 AC Schijndel, Niederlande",
    "contact": "contact@bolsius.com · www.bolsius.com"
  },
  "petex": {
    "name": "PETEX Auto-Ausstattungs-GmbH",
    "address": "Lauterbachstraße 44, 84307 Eggenfelden, Deutschland",
    "contact": "c.zogler@petex.net"
  },
  "vogtland": {
    "name": "Vogtlandmilch GmbH",
    "address": "Pausaer Straße 167, 08525 Plauen, Deutschland",
    "contact": "vogtlandmilch.de · Zulassungsnummer DE SN 008 EG"
  },
  "topstar": {
    "name": "Shenzhen Topstar Industry Co., Ltd. (INIU)",
    "address": "4011 Baoshan Times Building, Minqiang Community, Minzhi Street, Longhua District, Shenzhen, China"
  },
  "rolryz": {
    "name": "Przedsiębiorstwo Rol-Ryż Sp. z o.o.",
    "address": "Celna 2, 81-337 Gdynia, Polen"
  },
  "polonord": {
    "name": "Polonord Adeste S.r.l.",
    "address": "Via Clodoveo Bonazzi 7, 40013 Castel Maggiore, Bologna, Italien",
    "contact": "info@polonordadeste.it"
  },
  "tk": {
    "name": "T-KONTROL Resilience Solutions UG (haftungsbeschränkt)",
    "address": "Mittelstraße 1B, 13055 Berlin, Deutschland",
    "contact": "info@takekontrol.de"
  },
  "katadyn": {
    "name": "Katadyn Deutschland GmbH",
    "address": "Hessenring 23, 64546 Mörfelden-Walldorf, Deutschland",
    "contact": "eu@katadyngroup.com"
  },
  "colgate": {
    "name": "Colgate-Palmolive Europe Sàrl",
    "address": "4106 Therwil, Basel, Schweiz",
    "contact": "colgatepalmolive.com",
    "euRep": "Colgate-Palmolive Manufacturing (Poland) Sp. z o.o., PL-58-100 Świdnica"
  },
  "kaufland": {
    "name": "Kaufland Dienstleistung GmbH & Co. KG (K-Classic)",
    "address": "Rötelstraße 35, 74172 Neckarsulm, Deutschland",
    "contact": "kaufland.de"
  },
  "mattel": {
    "name": "Mattel Europa B.V.",
    "address": "1186 MJ Amstelveen, Niederlande",
    "contact": "info.de@mattel.com · 0080 00227201",
    "euRep": "Mattel GmbH, Solmsstraße 4, 60486 Frankfurt am Main · info.de@mattel.com · +49 69 7953300"
  },
  "schwartau": {
    "name": "Schwartauer Werke GmbH & Co. KG",
    "address": "Lübecker Straße 49–55, 23611 Bad Schwartau, Deutschland",
    "contact": "www.schwartauer-werke.de"
  },
  "fitflip": {
    "name": "BGT GmbH & Co. KG (FIT-FLIP)",
    "address": "Rennbahnallee 1, 5412 Puch bei Hallein, Salzburg, Österreich",
    "contact": "support@bgtaustria.com"
  },
  "cheeky": {
    "name": "The Cheeky Panda Limited",
    "address": "10 Lower Thames Street, London EC3R 6EN, Vereinigtes Königreich",
    "contact": "customer.services@cheekypanda.com"
  },
  "xdh": {
    "name": "XDH Tech (XINGO)",
    "address": "2 Rue Coysevox, Bureau 3, 69001 Lyon, Frankreich",
    "contact": "+33 6 52 76 88 98 · xdh.tech@outlook.com"
  },
  "atg": {
    "name": "ATG Hand Care (Pvt) Ltd.",
    "address": "Spur Road 7, Phase II, IPZ Katunayake, Sri Lanka",
    "contact": "info@atg-glovesolutions.com",
    "euRep": "J. Staffl – Arbeitsschutz GmbH, Mattseer Landesstraße 1a, 5161 Elixhausen, Österreich · office@staffl-arbeitsschutz.at"
  }
};

export const CATEGORIES = {
  "01": {
    "name": {
      "de": "Wasser & Lebensmittel",
      "en": "Water & Food"
    }
  },
  "02": {
    "name": {
      "de": "Strom & Licht",
      "en": "Power & Light"
    }
  },
  "03": {
    "name": {
      "de": "Kommunikation & Orientierung",
      "en": "Communication & Navigation"
    }
  },
  "04": {
    "name": {
      "de": "Brand- & Hitzeschutz",
      "en": "Fire & Heat Safety"
    }
  },
  "05": {
    "name": {
      "de": "Schutz & Erste Hilfe",
      "en": "Protection & First Aid"
    }
  },
  "06": {
    "name": {
      "de": "Dokumente & Organisation",
      "en": "Documents & Organisation"
    }
  },
  "07": {
    "name": {
      "de": "Werkzeug & Reparatur",
      "en": "Tools & Repair"
    }
  },
  "08": {
    "name": {
      "de": "Hygiene & Wohlbefinden",
      "en": "Hygiene & Wellbeing"
    }
  },
  "09": {
    "name": {
      "de": "Evakuierung & Mobilität",
      "en": "Evacuation & Mobility"
    }
  },
  "10": {
    "name": {
      "de": "Mentale Stärke & Ruhephasen",
      "en": "Mental Strength & Downtime"
    }
  }
};

export const KITS = {
  "essential": [
    {
      "categoryId": "01",
      "items": [
        {
          "productId": "notnahrung-und-muesliriegel",
          "quantity": {
            "de": "1 Packung mit 5 Riegeln",
            "en": "1 pack of 5 bars"
          }
        },
        {
          "productId": "seven-oceans-notfalltrinkwasser",
          "quantity": {
            "de": "2 × 500 ml",
            "en": "2 × 500 ml"
          }
        }
      ]
    },
    {
      "categoryId": "02",
      "items": [
        {
          "productId": "iniu-powerbank-usb-c-10-000-mah",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "05",
      "items": [
        {
          "productId": "petex-kfz-verbandtasche-din-13164",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "ffp2-masken",
          "quantity": {
            "de": "2",
            "en": "2"
          }
        }
      ]
    },
    {
      "categoryId": "06",
      "items": [
        {
          "productId": "notfall-checkliste",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "notfall-und-evakuierungs-qr-karte",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "07",
      "items": [
        {
          "productId": "amazon-basics-15-in-1-multifunktionswerkzeug",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "08",
      "items": [
        {
          "productId": "dr-beckmann-waschmittel-blaetter-universal",
          "quantity": {
            "de": "1 Originalpackung",
            "en": "1 Originalpackung"
          }
        }
      ]
    },
    {
      "categoryId": "09",
      "items": [
        {
          "productId": "wasserabweisender-notfallrucksack-45-10-l",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "regenjacke",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    }
  ],
  "standard": [
    {
      "categoryId": "01",
      "items": [
        {
          "productId": "notnahrung-und-muesliriegel",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "seven-oceans-notfalltrinkwasser",
          "quantity": {
            "de": "2 × 500 ml",
            "en": "2 × 500 ml"
          }
        }
      ]
    },
    {
      "categoryId": "02",
      "items": [
        {
          "productId": "iniu-powerbank-usb-c-10-000-mah",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "03",
      "items": [
        {
          "productId": "batteriebetriebenes-notfallradio",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "freytag-berndt-deutschlandkarte-1-500-000",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "05",
      "items": [
        {
          "productId": "petex-kfz-verbandtasche-din-13164",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "ffp2-masken",
          "quantity": {
            "de": "2",
            "en": "2"
          }
        }
      ]
    },
    {
      "categoryId": "06",
      "items": [
        {
          "productId": "wasserabweisende-dokumentenhuelle",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "kugelschreiber",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "notizbuch",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "notfall-checkliste",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "notfall-und-evakuierungs-qr-karte",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "07",
      "items": [
        {
          "productId": "amazon-basics-15-in-1-multifunktionswerkzeug",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "08",
      "items": [
        {
          "productId": "dr-beckmann-waschmittel-blaetter-universal",
          "quantity": {
            "de": "1 Originalpackung",
            "en": "1 Originalpackung"
          }
        },
        {
          "productId": "zahnbuerste",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "zahnpasta",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "feuchttuecher",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "toilettenpapier",
          "quantity": {
            "de": "1 Rolle",
            "en": "1 roll"
          }
        },
        {
          "productId": "taschentuecher",
          "quantity": {
            "de": "2 Packungen",
            "en": "2 packs"
          }
        },
        {
          "productId": "menstruationshygiene-notfallvorrat",
          "quantity": {
            "de": "6 einzeln verpackte Produkte",
            "en": "6 einzeln verpackte Produkte"
          }
        }
      ]
    },
    {
      "categoryId": "09",
      "items": [
        {
          "productId": "wasserabweisender-notfallrucksack-45-10-l",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "regenjacke",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    }
  ],
  "premium": [
    {
      "categoryId": "01",
      "items": [
        {
          "productId": "wasserfilterflasche",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "seven-oceans-notfalltrinkwasser",
          "quantity": {
            "de": "2 × 500 ml",
            "en": "2 × 500 ml"
          }
        },
        {
          "productId": "nrg-5-notration",
          "quantity": {
            "de": "1 × 500 g mit 9 Riegeln",
            "en": "1 × 500 g with 9 bars"
          }
        },
        {
          "productId": "corny-nussvoll-nuss-und-traube",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "campinggeschirr-edelstahl",
          "quantity": {
            "de": "1 Set für eine Person",
            "en": "1 set for one person"
          }
        }
      ]
    },
    {
      "categoryId": "02",
      "items": [
        {
          "productId": "addtop-solar-powerbank",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "anker-usb-c-ladegeraet-20-w",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "handkurbel-und-solar-notfalllampe",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "wiederaufladbarer-mini-ventilator",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "wiederaufladbare-aaa-batterien",
          "quantity": {
            "de": "1 Satz",
            "en": "1 set"
          }
        }
      ]
    },
    {
      "categoryId": "03",
      "items": [
        {
          "productId": "batteriebetriebenes-notfallradio",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "freytag-berndt-deutschlandkarte-1-500-000",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "04",
      "items": [
        {
          "productId": "abus-loeschdecke",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "05",
      "items": [
        {
          "productId": "ffp2-masken",
          "quantity": {
            "de": "5",
            "en": "5"
          }
        },
        {
          "productId": "schutzbrille",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "arbeitshandschuhe",
          "quantity": {
            "de": "1 Paar",
            "en": "1 pair"
          }
        },
        {
          "productId": "nitril-einweghandschuhe",
          "quantity": {
            "de": "1 Paar",
            "en": "1 pair"
          }
        },
        {
          "productId": "petex-kfz-verbandtasche-din-13164",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "multifunktionstuch",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "06",
      "items": [
        {
          "productId": "wasserabweisende-dokumentenhuelle",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "permanentmarker",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "kugelschreiber",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "notizbuch",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "notfall-checkliste",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "notfall-und-evakuierungs-qr-karte",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "07",
      "items": [
        {
          "productId": "bosch-multifunktionswerkzeug",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "kompaktes-gewebeklebeband",
          "quantity": {
            "de": "1 Rolle 50 mm x 5 m",
            "en": "1 roll 50 mm x 5 m"
          }
        },
        {
          "productId": "amazon-basics-reise-naehset",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "amazon-basics-geflochtenes-baumwollseil",
          "quantity": {
            "de": "1 Rolle 4,5 mm x 15 m",
            "en": "1 roll 4,5 mm x 15 m"
          }
        },
        {
          "productId": "mehrzweck-karabiner",
          "quantity": {
            "de": "6",
            "en": "6"
          }
        },
        {
          "productId": "pakomat-druckverschlussbeutel",
          "quantity": {
            "de": "10",
            "en": "10"
          }
        },
        {
          "productId": "kabelbinder",
          "quantity": {
            "de": "10",
            "en": "10"
          }
        },
        {
          "productId": "reissfeste-abfallbeutel",
          "quantity": {
            "de": "5",
            "en": "5"
          }
        }
      ]
    },
    {
      "categoryId": "08",
      "items": [
        {
          "productId": "taschentuecher",
          "quantity": {
            "de": "2 Packungen",
            "en": "2 packs"
          }
        },
        {
          "productId": "dr-beckmann-waschmittel-blaetter-universal",
          "quantity": {
            "de": "1 Originalpackung mit 25 Blatt",
            "en": "1 Originalpackung with 25 Blatt"
          }
        },
        {
          "productId": "zahnbuerste",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "zahnpasta",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "feuchttuecher",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "toilettenpapier",
          "quantity": {
            "de": "1 Rolle",
            "en": "1 roll"
          }
        },
        {
          "productId": "menstruationshygiene-notfallvorrat",
          "quantity": {
            "de": "6 einzeln verpackte Produkte",
            "en": "6 einzeln verpackte Produkte"
          }
        },
        {
          "productId": "kompaktes-mikrofasertuch",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "09",
      "items": [
        {
          "productId": "wasserabweisender-notfallrucksack-45-10-l",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "notbiwaksack",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "regenjacke",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    }
  ],
  "home": [
    {
      "categoryId": "01",
      "items": [
        {
          "productId": "lebensmittelechter-wasserkanister",
          "quantity": {
            "de": "1 × 20 Liter",
            "en": "1 × 20 litres"
          }
        },
        {
          "productId": "wasa-vollkorn-roggen",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "wasa-rustikal",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "k-classic-zarte-haferflocken",
          "quantity": {
            "de": "1 × 500 g",
            "en": "1 × 500 g"
          }
        },
        {
          "productId": "delverde-maccheronelli",
          "quantity": {
            "de": "1 × 500 g",
            "en": "1 × 500 g"
          }
        },
        {
          "productId": "k-classic-langkorn-reis",
          "quantity": {
            "de": "1 × 500 g mit 4 Kochbeuteln",
            "en": "1 × 500 g with 4 Kochbeuteln"
          }
        },
        {
          "productId": "sea-gold-heringsfilets-in-paprika-creme",
          "quantity": {
            "de": "1 × 200 g",
            "en": "1 × 200 g"
          }
        },
        {
          "productId": "erasco-fertiggerichte",
          "quantity": {
            "de": "3 Dosen",
            "en": "3 cans"
          }
        },
        {
          "productId": "vogtlandweide-h-vollmilch-3-5",
          "quantity": {
            "de": "1 Liter",
            "en": "1 litres"
          }
        },
        {
          "productId": "corny-nussvoll",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "nrg-5-notration",
          "quantity": {
            "de": "2 × 500 g",
            "en": "2 × 500 g"
          },
          "override": {
            "what": {
              "de": "Zwei kompakte, verzehrfertige Notrationen.",
              "en": "Two compact, ready-to-eat emergency rations."
            },
            "why": {
              "de": "Stellen eine energiedichte Reserve bereit, wenn Kochen nicht möglich ist.",
              "en": "Provide an energy-dense reserve when cooking is not possible."
            },
            "safety": {
              "de": "Enthält Weizen, Gerste und Soja; mit Wasser verzehren; MHD und Siegel prüfen.",
              "en": "Contains wheat, barley and soy; eat with water; check best-before date and seal."
            }
          }
        }
      ]
    },
    {
      "categoryId": "02",
      "items": [
        {
          "productId": "addtop-solar-powerbank",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "anker-usb-c-ladegeraet-20-w",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "handkurbel-und-solar-notfalllampe",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "wiederaufladbarer-mini-ventilator",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "wiederaufladbare-aaa-batterien",
          "quantity": {
            "de": "1 Satz",
            "en": "1 set"
          }
        }
      ]
    },
    {
      "categoryId": "03",
      "items": [
        {
          "productId": "batteriebetriebenes-notfallradio",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "04",
      "items": [
        {
          "productId": "teelichter-oder-kerzen",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "kohlenmonoxid-melder",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "abus-loeschdecke",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "05",
      "items": [
        {
          "productId": "ffp2-masken",
          "quantity": {
            "de": "5",
            "en": "5"
          }
        },
        {
          "productId": "schutzbrille",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "petex-kfz-verbandtasche-din-13164",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    },
    {
      "categoryId": "07",
      "items": [
        {
          "productId": "bosch-multifunktionswerkzeug",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "kompaktes-gewebeklebeband",
          "quantity": {
            "de": "1 Rolle 50 mm x 5 m",
            "en": "1 roll 50 mm x 5 m"
          }
        },
        {
          "productId": "amazon-basics-reise-naehset",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "reissfeste-abfallbeutel",
          "quantity": {
            "de": "1 Rolle",
            "en": "1 roll"
          },
          "override": {
            "what": {
              "de": "Große stabile Kunststoffbeutel.",
              "en": "Large sturdy plastic bags."
            },
            "why": {
              "de": "Unterstützen Abfallmanagement und die Trennung nasser Gegenstände.",
              "en": "Support waste management and separating wet items."
            },
            "safety": {
              "de": "Erstickungsgefahr; von Kindern und Gesicht fernhalten; nicht überladen.",
              "en": "Suffocation hazard; keep away from children and face; do not overload."
            }
          }
        }
      ]
    },
    {
      "categoryId": "08",
      "items": [
        {
          "productId": "zahnbuerste",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "zahnpasta",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "dr-beckmann-waschmittel-blaetter-universal",
          "quantity": {
            "de": "1 Originalpackung mit 25 Blatt",
            "en": "1 Originalpackung with 25 Blatt"
          }
        },
        {
          "productId": "feuchttuecher",
          "quantity": {
            "de": "1 Packung",
            "en": "1 pack"
          }
        },
        {
          "productId": "toilettenpapier",
          "quantity": {
            "de": "2 Rollen",
            "en": "2 rolln"
          }
        },
        {
          "productId": "taschentuecher",
          "quantity": {
            "de": "2 Packungen",
            "en": "2 packs"
          }
        },
        {
          "productId": "menstruationshygiene-notfallvorrat",
          "quantity": {
            "de": "1 vollständige Packung",
            "en": "1 vollständige pack"
          }
        }
      ]
    },
    {
      "categoryId": "10",
      "items": [
        {
          "productId": "uno-kartenspiel",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        },
        {
          "productId": "puzzle-oder-puzzlematte",
          "quantity": {
            "de": "1",
            "en": "1"
          }
        }
      ]
    }
  ]
};
