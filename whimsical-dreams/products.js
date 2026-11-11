/*
  ============================================================
  PRODUCT LIST — edit this file to add, remove, or change items.
  ============================================================

  Each item looks like this:

    {
      name: "Houseplant Clips",
      price: 12,                 // number, no $ sign. Use null to hide the price.
      category: "clothing",      // "plants", "clothing", or "decor"
      image: "images/houseplant-clips.jpg",   // leave "" if no photo yet
      lowStock: true             // true shows the red "Low stock" label
    },

  To add a photo: put the picture in the "images" folder and type its file name.

  NOTE: The items below were copied from screenshots of the old site.
  Items marked "CHECK" need a real name, price, or photo filled in.
*/

const PRODUCTS = [
  // ---------- Plants (old site listed 21) ----------
  { name: "Pothos Cutting in Water", price: null, category: "plants", image: "images/pothos-water.jpg", lowStock: false }, // CHECK name + price
  { name: "Hanging Pothos", price: null, category: "plants", image: "", lowStock: false }, // CHECK name, price + photo

  // ---------- Clothing and Wares (old site listed 18) ----------
  { name: "Houseplant Clips", price: 12, category: "clothing", image: "images/houseplant-clips.jpg", lowStock: true },
  { name: "Sardine Hairclip", price: 12, category: "clothing", image: "", lowStock: true }, // CHECK photo
  { name: "Peacock Hairclip", price: 12, category: "clothing", image: "images/peacock-hairclip.jpg", lowStock: false }, // CHECK price

  // ---------- Home Decor, Crafts, and Treasures ----------
  { name: "Vintage Gold Trimmed Trinket Glass Box", price: 35, category: "decor", image: "images/trinket-box.jpg", lowStock: true },
];
