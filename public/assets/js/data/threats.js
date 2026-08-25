/**
 * takeKONTROL — European disaster scenarios
 * =================================================================
 * The 25-scenario dataset behind the threat browser on the home page,
 * lifted verbatim out of the inline <script> in index.html. Roughly
 * 130 lines of data had been sitting in the middle of the page's
 * behaviour code; editing a scenario meant editing the page.
 *
 * `image` is a bare filename; the page module prefixes assets/img/.
 * =================================================================
 */

export const THREATS = {
  de: {
    "Naturbedingte Katastrophen": {
        icon: "fa-solid fa-cloud-sun",
        image: "Natural-Disasters.png",
        threats: [
            { name: "Schweres Erdbeben", desc: "Massive Schäden in Industrie- oder Ballungsräumen mit hohen Opferzahlen.", likelihood: "Niedrig", impact: "Sehr Hoch", speed: "Sofort", consequences: ["Gebäudeeinstürze", "Massenverletzungen", "Verzögerte Rettung", "Nachbeben"], products: [{ name: "Essential Rucksack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Vulkanausbruch", desc: "Toxische Asche stoppt den Luftverkehr und führt zu einem Temperaturabfall.", likelihood: "Niedrig", impact: "Hoch", speed: "Mittel", consequences: ["Flugausfälle", "Aschekontamination", "Ernteschäden", "Temperaturabfall"], products: [{ name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }, { name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Extreme Kälte", desc: "Legt die Infrastruktur nördlich des 50. Breitengrades und in Bergregionen lahm.", likelihood: "Mittel", impact: "Hoch", speed: "Mittel", consequences: ["Vereiste Infrastruktur", "Stromausfälle", "Verkehrslähmung", "Unterkühlungsrisiko"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Hitzewelle & Waldbrände", desc: "Austrocknung von Regionen führt zu massiven Bränden und Dehydrierung.", likelihood: "Hoch", impact: "Hoch", speed: "Schnell", consequences: ["Waldbrandausbreitung", "Dehydrierung", "Ernteausfälle", "Schlechte Luftqualität"], products: [{ name: "Essential Rucksack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Wasser- & Nahrungsknappheit", desc: "Verursacht durch Klimawandel, was zu massiver Fluchtmigration nach Europa führt.", likelihood: "Mittel", impact: "Sehr Hoch", speed: "Langsam", consequences: ["Massenmigration", "Preisschocks", "Mangelernährung", "Soziale Unruhen"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Meteoriteneinschlag", desc: "Nahe einem Ballungsraum, verursacht enorme Schäden durch Druckwellen.", likelihood: "Niedrig", impact: "Sehr Hoch", speed: "Sofort", consequences: ["Druckwellenschäden", "Massenverletzungen", "Infrastrukturkollaps", "Brände"], products: [{ name: "Essential Rucksack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Premium Rucksack", href: "takekontrol-revamp.html#premium-backpack" }] },
            { name: "Tsunami", desc: "In der Nordsee, Ostsee oder im Mittelmeer, der weitreichende Überschwemmungen auslöst.", likelihood: "Niedrig", impact: "Sehr Hoch", speed: "Schnell", consequences: ["Küstenüberflutung", "Zerstörte Infrastruktur", "Massenevakuierung", "Verunreinigtes Wasser"], products: [{ name: "Essential Rucksack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Sonnensturm", desc: "Elektromagnetische Störungen lahmen GNSS, Funk und Elektronik weltweit.", likelihood: "Mittel", impact: "Hoch", speed: "Schnell", consequences: ["GPS-Ausfall", "Schäden am Stromnetz", "Kommunikationsausfall", "Flugverkehrsstörungen"], products: [{ name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }, { name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Meeresspiegelanstieg", desc: "Dauerhafte Überflutung tiefliegender Küstenregionen.", likelihood: "Hoch", impact: "Mittel", speed: "Langsam", consequences: ["Küstenvertreibung", "Eigentumsverlust", "Süßwasserkontamination", "Infrastrukturerosion"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Tier- oder Pflanzenkrankheiten", desc: "Führt zu kritischer Lebensmittelknappheit in Europa.", likelihood: "Mittel", impact: "Hoch", speed: "Langsam", consequences: ["Tierkeulung", "Ernteverlust", "Preisanstieg bei Lebensmitteln", "Lieferkettenlücken"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] }
        ]
    },
    "Gesundheitsnotfälle": {
        icon: "fa-solid fa-kit-medical",
        image: "Epidemics-Pandemics.png",
        threats: [
            { name: "Epidemic / Pandemie", desc: "Wütet in Europa, verursacht akuten Medikamentenmangel und massiven Arbeitsausfall.", likelihood: "Hoch", impact: "Sehr Hoch", speed: "Langsam", consequences: ["Medikamentenmangel", "Arbeitskräftemangel", "Lockdowns", "Lieferunterbrechungen"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Premium Rucksack", href: "takekontrol-revamp.html#premium-backpack" }] }
        ]
    },
    "Kritische Infrastrukturen": {
        icon: "fa-solid fa-bolt",
        image: "Critical-Infrastructure-Failures.png",
        threats: [
            { name: "Stromausfall (Blackout)", desc: "Weite Teile Europas sind über einen längeren Zeitraum ohne Strom.", likelihood: "Mittel", impact: "Sehr Hoch", speed: "Schnell", consequences: ["Kein Strom", "Kühlkettenverlust", "Kommunikationsausfall", "Ausfall der Wasserpumpen"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Internetkollaps", desc: "Ein langanhaltender Ausfall, dessen Wiederherstellung immense Zeit beansprucht.", likelihood: "Mittel", impact: "Hoch", speed: "Schnell", consequences: ["Bankenausfall", "Kommunikationsverlust", "Betriebsstillstand", "Überlastung der Rettungsdienste"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Kollaps des Gesundheitssystems", desc: "Überlastung durch Massen von Schwerverletzten oder hochinfektiösen Patienten.", likelihood: "Mittel", impact: "Sehr Hoch", speed: "Mittel", consequences: ["Behandlungsverzögerungen", "Medikamentenmangel", "Erschöpftes Personal", "Steigende Sterblichkeit"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Premium Rucksack", href: "takekontrol-revamp.html#premium-backpack" }] },
            { name: "Schließung von Seehäfen", desc: "Große europäische Häfen sind zu Wasser und zu Land blockiert.", likelihood: "Niedrig", impact: "Hoch", speed: "Mittel", consequences: ["Importengpässe", "Treibstoffknappheit", "Preisinflation", "Blockierte Lieferketten"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Kollaps des Währungssystems", desc: "Der Euro verliert drastisch an Wert, Staaten müssen auf Tauschhandel umstellen.", likelihood: "Niedrig", impact: "Sehr Hoch", speed: "Schnell", consequences: ["Vernichtete Ersparnisse", "Tauschhandel-Wirtschaft", "Bankenstürme", "Handelsunterbrechung"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Premium Rucksack", href: "takekontrol-revamp.html#premium-backpack" }] },
            { name: "Öl- und Gasknappheit", desc: "Ausgelöst durch geopolitisch-militärische Krisen.", likelihood: "Mittel", impact: "Hoch", speed: "Mittel", consequences: ["Treibstoffrationierung", "Heizungsengpässe", "Transportunterbrechung", "Preisschübe"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] }
        ]
    },
    "Menschengemacht": {
        icon: "fa-solid fa-triangle-exclamation",
        image: "Human-Made-Emergencies.png",
        threats: [
            { name: "Koordinierte Terrorangriffe", desc: "Gezielte Zerstörung von kritischer Infrastruktur und Kulturgütern.", likelihood: "Mittel", impact: "Sehr Hoch", speed: "Sofort", consequences: ["Massenverletzungen", "Infrastrukturschäden", "Öffentliche Panik", "Anhaltende Sperrungen"], products: [{ name: "Essential Rucksack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Atomkraftwerk-Störfall", desc: "Freisetzung von Radioaktivität, die Evakuierungen und großflächige Dekontamination erfordert.", likelihood: "Niedrig", impact: "Sehr Hoch", speed: "Schnell", consequences: ["Strahlenexposition", "Massenevakuierung", "Kontaminiertes Land", "Langfristige Gesundheitsrisiken"], products: [{ name: "Essential Rucksack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Premium Rucksack", href: "takekontrol-revamp.html#premium-backpack" }] },
            { name: "Massive Umweltverschmutzung", desc: "Zerstörung von Boden, Luft und Wasser (z.B. durch riesige Ölteppiche).", likelihood: "Mittel", impact: "Hoch", speed: "Mittel", consequences: ["Wasserkontamination", "Ökosystemkollaps", "Gesundheitsgefahren", "Landwirtschaftliche Verluste"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] }
        ]
    },
    "Soziale Katastrophen": {
        icon: "fa-solid fa-people-group",
        image: "Social-Crises-scenarios.png",
        threats: [
            { name: "Ressourcenüberverbrauch", desc: "Die Ungleichheit beim Verbrauch gefährdet die globale und wirtschaftliche Stabilität.", likelihood: "Hoch", impact: "Mittel", speed: "Langsam", consequences: ["Ressourcenknappheit", "Wirtschaftliche Instabilität", "Preisvolatilität", "Soziale Ungleichheit"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Gescheiterte Integration", desc: "Politische Radikalisierung und Nationalismus destabilisieren europäische Staaten.", likelihood: "Mittel", impact: "Hoch", speed: "Langsam", consequences: ["Politische Instabilität", "Zivile Unruhen", "Radikalisierung", "Geschwächte Institutionen"], products: [{ name: "Standard Rucksack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Jugendarbeitslosigkeit", desc: "Führt zu aggressiven Unruhen, die das öffentliche Leben in Großstädten lahmlegen.", likelihood: "Hoch", impact: "Mittel", speed: "Mittel", consequences: ["Städtische Unruhen", "Ausschreitungen", "Sachschäden", "Störung des Nahverkehrs"], products: [{ name: "Essential Rucksack", href: "takekontrol-revamp.html#essential-backpack" }] },
            { name: "Sozioökonomisches Gefälle", desc: "Löst eine große Anzahl von Binnenflüchtlingen (IDP) innerhalb Europas aus.", likelihood: "Hoch", impact: "Mittel", speed: "Langsam", consequences: ["Binnenvertreibung", "Wohnraumdruck", "Soziale Spannungen", "Ressourcenkonkurrenz"], products: [{ name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] }
        ]
    },
    "Geopolitische Krisen": {
        icon: "fa-solid fa-globe",
        image: "Social-Crises-scenarios.png",
        threats: [
            { name: "Krieg vor den Toren Europas", desc: "Führt zu asymmetrischer Kriegsführung und Flüchtlingswellen.", likelihood: "Mittel", impact: "Sehr Hoch", speed: "Schnell", consequences: ["Flüchtlingswellen", "Asymmetrische Kriegsführung", "Lieferunterbrechungen", "Wirtschaftliche Sanktionsfolgen"], products: [{ name: "Premium Rucksack", href: "takekontrol-revamp.html#premium-backpack" }, { name: "Notfallvorrat-Set", href: "takekontrol-revamp.html#home-kit" }] }
        ]
    }
},

  en: {
    "Natural Hazards": {
        icon: "fa-solid fa-cloud-sun",
        image: "Natural-Disasters.png",
        threats: [
            { name: "Violent earthquake", desc: "Massive damage in industrial or metropolitan areas with high casualties.", likelihood: "Low", impact: "Very High", speed: "Instant", consequences: ["Building collapse", "Mass casualties", "Delayed rescue", "Aftershocks"], products: [{ name: "Essential Backpack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Volcanic eruption", desc: "Toxic ash stops air traffic and leads to a temperature drop.", likelihood: "Low", impact: "High", speed: "Moderate", consequences: ["Flight cancellations", "Ash contamination", "Crop damage", "Temperature drop"], products: [{ name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }, { name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Extreme coldness", desc: "Immobilizes infrastructure north of the 50th latitude and in mountainous regions.", likelihood: "Medium", impact: "High", speed: "Moderate", consequences: ["Frozen infrastructure", "Power outages", "Transport paralysis", "Hypothermia risk"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Heat wave & bush fires", desc: "Drying of regions leads to massive fires and dehydration.", likelihood: "High", impact: "High", speed: "Fast", consequences: ["Wildfire spread", "Dehydration", "Crop failure", "Poor air quality"], products: [{ name: "Essential Backpack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Water & food shortage", desc: "Caused by climate change, leading to massive displacement towards Europe.", likelihood: "Medium", impact: "Very High", speed: "Slow", consequences: ["Mass migration", "Price shocks", "Malnutrition", "Social unrest"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Meteorite crash", desc: "Near a metropolitan area, causing enormous damage from shock waves.", likelihood: "Low", impact: "Very High", speed: "Instant", consequences: ["Shockwave destruction", "Mass casualties", "Infrastructure collapse", "Fires"], products: [{ name: "Essential Backpack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Premium Backpack", href: "takekontrol-revamp.html#premium-backpack" }] },
            { name: "Tsunami", desc: "In the North Sea, Baltic Sea, or Mediterranean causing widespread flooding.", likelihood: "Low", impact: "Very High", speed: "Fast", consequences: ["Coastal flooding", "Destroyed infrastructure", "Mass evacuation", "Contaminated water"], products: [{ name: "Essential Backpack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Severe sun storm", desc: "Electromagnetic disturbances cripple GNSS, radio, and electronics worldwide.", likelihood: "Medium", impact: "High", speed: "Fast", consequences: ["GPS failure", "Power grid damage", "Communication blackout", "Aviation disruption"], products: [{ name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }, { name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Sea level ascends", desc: "Permanent flooding of low-lying coastal regions.", likelihood: "High", impact: "Medium", speed: "Slow", consequences: ["Coastal displacement", "Property loss", "Freshwater contamination", "Infrastructure erosion"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Animal or plant disease", desc: "Leads to critical food shortages in Europe.", likelihood: "Medium", impact: "High", speed: "Slow", consequences: ["Livestock culling", "Crop loss", "Food price surge", "Supply chain gaps"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] }
        ]
    },
    "Health Emergencies": {
        icon: "fa-solid fa-kit-medical",
        image: "Epidemics-Pandemics.png",
        threats: [
            { name: "Epidemic / Pandemic", desc: "Rages in Europe, causing acute drug shortages and massive workforce incapacity.", likelihood: "High", impact: "Very High", speed: "Slow", consequences: ["Medicine shortages", "Workforce shortages", "Lockdowns", "Supply disruptions"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Premium Backpack", href: "takekontrol-revamp.html#premium-backpack" }] }
        ]
    },
    "Critical Infrastructure": {
        icon: "fa-solid fa-bolt",
        image: "Critical-Infrastructure-Failures.png",
        threats: [
            { name: "Power Grid Failure", desc: "Widespread sections of Europe are without electrical power for a longer period.", likelihood: "Medium", impact: "Very High", speed: "Fast", consequences: ["No electricity", "Refrigeration loss", "Communication down", "Water pump failure"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Internet collapse", desc: "A long-lasting failure whose restoration requires immense time.", likelihood: "Medium", impact: "High", speed: "Fast", consequences: ["Banking disruption", "Communication loss", "Business shutdown", "Emergency services strain"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Health system collapse", desc: "Overload due to masses of severely injured or highly infectious patients.", likelihood: "Medium", impact: "Very High", speed: "Moderate", consequences: ["Treatment delays", "Medicine shortages", "Staff burnout", "Rising mortality"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Premium Backpack", href: "takekontrol-revamp.html#premium-backpack" }] },
            { name: "Seaports shut down", desc: "Major European ports are blocked by land and sea.", likelihood: "Low", impact: "High", speed: "Moderate", consequences: ["Import shortages", "Fuel scarcity", "Price inflation", "Supply chain gridlock"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Currency system collapse", desc: "The Euro drastically loses value; states must rely on barter.", likelihood: "Low", impact: "Very High", speed: "Fast", consequences: ["Savings wiped out", "Barter economy", "Bank runs", "Trade disruption"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Premium Backpack", href: "takekontrol-revamp.html#premium-backpack" }] },
            { name: "Oil and gas shortage", desc: "Triggered by geopolitical-military crises.", likelihood: "Medium", impact: "High", speed: "Moderate", consequences: ["Fuel rationing", "Heating shortages", "Transport disruption", "Price spikes"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }, { name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] }
        ]
    },
    "Man-made Disasters": {
        icon: "fa-solid fa-triangle-exclamation",
        image: "Human-Made-Emergencies.png",
        threats: [
            { name: "Coordinated terror attacks", desc: "Targeted destruction of critical infrastructure and cultural assets.", likelihood: "Medium", impact: "Very High", speed: "Instant", consequences: ["Mass casualties", "Infrastructure damage", "Public panic", "Extended lockdowns"], products: [{ name: "Essential Backpack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Nuclear power plant incident", desc: "Release of radioactivity requiring evacuations and large-scale decontamination.", likelihood: "Low", impact: "Very High", speed: "Fast", consequences: ["Radiation exposure", "Mass evacuation", "Contaminated land", "Long-term health risk"], products: [{ name: "Essential Backpack", href: "takekontrol-revamp.html#essential-backpack" }, { name: "Premium Backpack", href: "takekontrol-revamp.html#premium-backpack" }] },
            { name: "Massive environmental pollution", desc: "Destruction of soil, air, and water (e.g., via massive oil spills).", likelihood: "Medium", impact: "High", speed: "Moderate", consequences: ["Water contamination", "Ecosystem collapse", "Health hazards", "Agricultural loss"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] }
        ]
    },
    "Social Disasters": {
        icon: "fa-solid fa-people-group",
        image: "Social-Crises-scenarios.png",
        threats: [
            { name: "Resource overconsumption", desc: "Inequality in consumption threatens global and economic stability.", likelihood: "High", impact: "Medium", speed: "Slow", consequences: ["Resource scarcity", "Economic instability", "Price volatility", "Social inequality"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] },
            { name: "Failed integration", desc: "Political radicalization and nationalism destabilize European states.", likelihood: "Medium", impact: "High", speed: "Slow", consequences: ["Political instability", "Civil unrest", "Radicalization", "Weakened institutions"], products: [{ name: "Standard Backpack", href: "takekontrol-revamp.html#standard-backpack" }] },
            { name: "Youth unemployment", desc: "Leads to aggressive unrest paralyzing public life in major cities.", likelihood: "High", impact: "Medium", speed: "Moderate", consequences: ["Urban unrest", "Riots", "Property damage", "Public transport disruption"], products: [{ name: "Essential Backpack", href: "takekontrol-revamp.html#essential-backpack" }] },
            { name: "Socio-economical gradient", desc: "Triggers a large number of Internally Displaced People (IDP) within Europe.", likelihood: "High", impact: "Medium", speed: "Slow", consequences: ["Internal displacement", "Housing strain", "Social tension", "Resource competition"], products: [{ name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] }
        ]
    },
    "Geopolitical Crises": {
        icon: "fa-solid fa-globe",
        image: "Social-Crises-scenarios.png",
        threats: [
            { name: "War at the gates of Europe", desc: "Leads to asymmetric warfare and waves of refugees.", likelihood: "Medium", impact: "Very High", speed: "Fast", consequences: ["Refugee waves", "Asymmetric warfare", "Supply disruption", "Economic sanctions fallout"], products: [{ name: "Premium Backpack", href: "takekontrol-revamp.html#premium-backpack" }, { name: "Home Preparedness Kit", href: "takekontrol-revamp.html#home-kit" }] }
        ]
    }
}
};