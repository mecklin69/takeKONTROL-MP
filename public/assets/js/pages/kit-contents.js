/**
 * takeKONTROL — kit contents renderer
 * =================================================================
 * Builds the "What's inside" accordion for each kit from
 * data/kit-contents.js: categories → items → (on click) what it is,
 * why it's included, a safety note, full manufacturer / EU-representative
 * identification, and, for food items, the legally required nutrition
 * and allergen table. This is the real compliance content for what is
 * actually in the box, not placeholder copy.
 * =================================================================
 */

import { CATEGORIES, KITS, MANUFACTURERS, PRODUCTS } from '../data/kit-contents.js';
import { currentLang } from '../core/i18n.js';
import { escapeHtml } from '../core/dom.js';

const LABELS = {
  de: {
    what: 'Was ist das?', why: 'Warum enthalten?', safety: 'Sicherheit',
    includedIn: 'Verpackung',
    mfrToggle: 'Hersteller & Kennzeichnung', mfrManufacturer: 'Hersteller', mfrAddress: 'Anschrift',
    mfrContact: 'Kontakt', mfrEuRep: 'Verantwortliche Person in der EU', mfrModel: 'Modell',
    mfrWeee: 'WEEE-Reg.-Nr.', mfrBattery: 'Batt-Reg.-Nr.', mfrVia: 'Registriert über',
    foodTitle: 'Lebensmittelinformationen', foodAllergens: 'Allergene', foodLegalName: 'Bezeichnung',
    foodNet: 'Nettofüllmenge', foodIngredients: 'Zutaten', foodStorage: 'Lagerung',
    foodPreparation: 'Zubereitung', foodOrigin: 'Ursprung', foodNutrition: 'Nährwerte je 100 g / 100 ml',
    foodOperator: 'Lebensmittelunternehmer',
    foodAuthoritative: 'Maßgeblich sind stets die Angaben auf der Verpackung des gelieferten Produkts.',
    foodLangNote: '',
    energyKj: 'Energie (kJ)', energyKcal: 'Energie (kcal)', fat: 'Fett',
    saturates: 'davon gesättigte Fettsäuren', carbohydrate: 'Kohlenhydrate', sugars: 'davon Zucker',
    protein: 'Eiweiß', salt: 'Salz',
    ageRestricted: 'Abgabe nur an Personen ab 18 Jahren.',
    itemCount: 'Artikel'
  },
  en: {
    what: 'What is it?', why: 'Why included?', safety: 'Safety',
    includedIn: 'Packaging',
    mfrToggle: 'Manufacturer & identification', mfrManufacturer: 'Manufacturer', mfrAddress: 'Address',
    mfrContact: 'Contact', mfrEuRep: 'Responsible person in the EU', mfrModel: 'Model',
    mfrWeee: 'WEEE reg. no.', mfrBattery: 'Battery reg. no.', mfrVia: 'Registered via',
    foodTitle: 'Food information', foodAllergens: 'Allergens', foodLegalName: 'Name of the food',
    foodNet: 'Net quantity', foodIngredients: 'Ingredients', foodStorage: 'Storage',
    foodPreparation: 'Preparation', foodOrigin: 'Origin', foodNutrition: 'Nutrition per 100 g / 100 ml',
    foodOperator: 'Food business operator',
    foodAuthoritative: 'The information on the packaging of the delivered product is always authoritative.',
    foodLangNote: 'Ingredients, allergens and storage are shown in German as printed on the packaging.',
    energyKj: 'Energy (kJ)', energyKcal: 'Energy (kcal)', fat: 'Fat',
    saturates: 'of which saturates', carbohydrate: 'Carbohydrate', sugars: 'of which sugars',
    protein: 'Protein', salt: 'Salt',
    ageRestricted: 'Sold only to persons aged 18 or over.',
    itemCount: 'items'
  }
};

const NUTRIENTS = [
  ['energyKj', 'kJ'], ['energyKcal', 'kcal'], ['fat', 'g'], ['saturates', 'g', true],
  ['carbohydrate', 'g'], ['sugars', 'g', true], ['protein', 'g'], ['salt', 'g']
];

const L = () => LABELS[currentLang()] || LABELS.de;
const pick = (obj) => (obj ? (obj[currentLang()] || obj.de || '') : '');

function renderManufacturer(product) {
  const t = L();
  const rows = [];
  const mfr = product.manufacturerId ? MANUFACTURERS[product.manufacturerId] : null;

  if (mfr) {
    rows.push([t.mfrManufacturer, mfr.name]);
    if (mfr.address) rows.push([t.mfrAddress, mfr.address]);
    if (mfr.contact) rows.push([t.mfrContact, mfr.contact]);
    if (mfr.euRep) rows.push([t.mfrEuRep, mfr.euRep]);
  } else if (product.manufacturerText) {
    rows.push([t.mfrManufacturer, product.manufacturerText]);
  }
  if (product.model) rows.push([t.mfrModel, product.model]);

  const reg = product.registration;
  if (reg) {
    if (reg.weee) rows.push([t.mfrWeee, reg.weee]);
    if (reg.battery) rows.push([t.mfrBattery, reg.battery]);
    if (reg.registeredVia) rows.push([t.mfrVia, reg.registeredVia]);
  }

  if (rows.length === 0) return '';

  return `<details class="mfr"><summary>${escapeHtml(t.mfrToggle)}</summary>
    <div class="mfr__body"><table>${rows.map(([label, value]) =>
      `<tr><td>${escapeHtml(label)}</td><td>${escapeHtml(value)}</td></tr>`).join('')}</table></div>
  </details>`;
}

function renderFoodInfo(food) {
  const t = L();
  return food.map((f) => {
    const hasNutrition = f.nutrition && Object.values(f.nutrition).some((v) => v);
    return `<div class="food-info">
      <h4>${escapeHtml(t.foodTitle)}</h4>
      ${f.allergens ? `<div class="food-info__allergens"><span>${escapeHtml(t.foodAllergens)}:</span> ${escapeHtml(f.allergens)}${f.traces ? ` <span class="food-info__traces">${escapeHtml(f.traces)}</span>` : ''}</div>` : ''}
      <table class="food-info__facts">
        ${f.legalName ? `<tr><td>${escapeHtml(t.foodLegalName)}</td><td>${escapeHtml(pick(f.legalName))}</td></tr>` : ''}
        ${f.netQuantity ? `<tr><td>${escapeHtml(t.foodNet)}</td><td>${escapeHtml(f.netQuantity)}</td></tr>` : ''}
        ${f.ingredients ? `<tr><td>${escapeHtml(t.foodIngredients)}</td><td>${escapeHtml(f.ingredients)}</td></tr>` : ''}
        ${f.storage ? `<tr><td>${escapeHtml(t.foodStorage)}</td><td>${escapeHtml(f.storage)}</td></tr>` : ''}
        ${f.preparation ? `<tr><td>${escapeHtml(t.foodPreparation)}</td><td>${escapeHtml(f.preparation)}</td></tr>` : ''}
        ${f.origin ? `<tr><td>${escapeHtml(t.foodOrigin)}</td><td>${escapeHtml(f.origin)}</td></tr>` : ''}
      </table>
      ${hasNutrition ? `<table class="food-info__nutrition"><caption>${escapeHtml(t.foodNutrition)}</caption><tbody>
        ${NUTRIENTS.map(([key, unit, sub]) => f.nutrition[key]
          ? `<tr${sub ? ' class="sub"' : ''}><td>${escapeHtml(t[key])}</td><td>${escapeHtml(f.nutrition[key])} ${unit}</td></tr>`
          : '').join('')}
      </tbody></table>` : ''}
      ${f.operator ? `<p class="food-info__note">${escapeHtml(t.foodOperator)}: ${escapeHtml(f.operator)}${f.operatorAddress ? `, ${escapeHtml(f.operatorAddress)}` : ''}</p>` : ''}
      ${currentLang() !== 'de' && t.foodLangNote ? `<p class="food-info__note">${escapeHtml(t.foodLangNote)}</p>` : ''}
      <p class="food-info__note">${escapeHtml(t.foodAuthoritative)}</p>
    </div>`;
  }).join('');
}

function renderItem(entry) {
  const t = L();
  const product = PRODUCTS[entry.productId];
  if (!product) return '';
  const o = entry.override || {};
  const what = o.what || product.what;
  const why = o.why || product.why;
  const safety = o.safety || product.safety;

  return `<div class="checklist-item">
    <button class="checklist-item__head" type="button" aria-expanded="false">
      <i class="fa-solid fa-circle-check"></i>
      <span class="checklist-item__name">${escapeHtml(pick(product.name))}</span>
      <span class="checklist-item__qty">${escapeHtml(pick(entry.quantity))}</span>
      <span class="chev" aria-hidden="true"><i class="fa-solid fa-chevron-down"></i></span>
    </button>
    <div class="checklist-item__body" hidden>
      <dl class="checklist-item__facts">
        <dt>${escapeHtml(t.what)}</dt><dd>${escapeHtml(pick(what))}</dd>
        <dt>${escapeHtml(t.why)}</dt><dd>${escapeHtml(pick(why))}</dd>
        <dt>${escapeHtml(t.safety)}</dt><dd>${escapeHtml(pick(safety))}</dd>
        ${product.includedIn ? `<dt>${escapeHtml(t.includedIn)}</dt><dd>${escapeHtml(pick(product.includedIn))}</dd>` : ''}
      </dl>
      ${product.ageRestricted ? `<p class="checklist-item__age"><i class="fa-solid fa-triangle-exclamation"></i> ${escapeHtml(t.ageRestricted)}</p>` : ''}
      ${product.food ? renderFoodInfo(product.food) : ''}
      ${renderManufacturer(product)}
    </div>
  </div>`;
}

function renderCategory(group, index) {
  const cat = CATEGORIES[group.categoryId];
  if (!cat) return '';
  const t = L();
  return `<details class="cat"${index === 0 ? ' open' : ''}>
    <summary>
      <span class="cat__num">${escapeHtml(group.categoryId)}</span>
      <span class="cat__name">${escapeHtml(pick(cat.name))}</span>
      <span class="cat__count">${group.items.length} ${escapeHtml(t.itemCount)}</span>
      <span class="chev" aria-hidden="true"><i class="fa-solid fa-chevron-down"></i></span>
    </summary>
    <div class="cat__body">
      ${group.items.map(renderItem).join('')}
    </div>
  </details>`;
}

function renderKit(kitId) {
  const groups = KITS[kitId];
  if (!groups) return '';
  return groups.map(renderCategory).join('');
}

export function renderKitContents(root = document) {
  for (const mount of root.querySelectorAll('[data-kit-contents]')) {
    mount.innerHTML = renderKit(mount.dataset.kitContents);
  }
}
