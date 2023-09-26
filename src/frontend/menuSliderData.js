import sauce1 from "../assets/sauces1.jpeg";
import sauce2 from "../assets/sauces2.jpeg";
import sauce3 from "../assets/sauces3.jpeg";
import sauce4 from "../assets/sauces4.jpeg";

const Burgers = [
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FYung%20Saucy%20Saucy%20Burger?alt=media&token=d90e5ea8-f8f0-4e62-92b7-d19bb692bfbb",
    title: "Yung Saucy Saucy Burger",
    text: "Sauciest on the menu",
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FBurgers.png?alt=media&token=54ea264a-c40e-44ab-97c5-7b2d6237d2c3",
    title: "Dudu Burger",
    text: "Cheesiest on the Menu",
    duration: 3000,
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FShredded%20Chicken%20Burger%202.jpg?alt=media&token=8da350a9-8e65-465f-a1b4-4c29fcc8f03a",
    title: "Shredded Chicken Burger",
    text: "Life is too short to miss our juicy burgers",
    // fullWidth: true,
  },
];

const Chicken = [
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FGrilled%20Chicken.png?alt=media&token=eb71a283-61c9-437b-b21d-508444aaf610",
    title: "Full Flame Grilled Chicken",
    text: "Saucy Flame Grilled chicken on the menu for the family",
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2F1%2F2%20Chicken?alt=media&token=e5315955-058f-45b6-97a3-5e5e7c53e414",
    title: "Half Flame Grilled Chicken",
    text: "Saucy Flame Grilled chicken on the menu for 2.",
    duration: 3000,
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2F1%2F4%20Chicken?alt=media&token=ea797928-02f2-49c2-b930-d9a6c2515c16",
    title: "Quarter Flame Grilled Chicken",
    text: "Saucy Flame Grilled chicken on the menu for 1.",
    // fullWidth: true,
  },
];

const Pizza = [
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FMARGHERITA?alt=media&token=b8703f29-1756-41d1-a061-4fd6294378b7",
    title: "The Blazing Margherita Pizza",
    text: "The Basic Tasty Pizza",
  },

  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FVEGETARIAN?alt=media&token=4907983f-72f3-48fe-b988-7d4dd30125a2",
    title: "The Vegetarian Pizza",
    text: "Famous Veggie Pizza",
    duration: 3000,
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FMexicana?alt=media&token=25887539-f6fd-41b8-b54b-b788e8923357",
    title: "The Mexican Pizza",
    text: "Hottest and Spiciest on the Menu",
    // fullWidth: true,
  },
];

const SloppieJoe = [
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FStreet%20Dogg?alt=media&token=71308a08-d3f0-484f-8d5d-cbec82f93a69",
    title: "Street Dogg",
    text: "The Sauciest Street Dog You Will Find.",
  },

  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FLoaded%20Dogg%202.jpg?alt=media&token=e6f75a80-e2db-4328-b3d6-a3fb2307df6b",
    title: "Loaded Dogg",
    text: "The Flaming Fully Tasty Fully Loaded Dogg.",
    duration: 3000,
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2FSLOPPY%20JOE?alt=media&token=746a211d-a8ed-4c42-9737-ed4c695fe197",
    title: "Sloppy Joe",
    text: "The Ultimate Blazy Spicy roll worth a try.",
    // fullWidth: true,
  },
];

const Wings = [
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2F12%20BBQ%20WINGS?alt=media&token=d79320dd-917c-49ed-bc58-fe1e8b1abe0d",
    title: "Barbeque Wings",
    text: "The Sauciest and Tastiest Wings You Will Find.",
  },

  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2F6%20SPICY%20WINGS?alt=media&token=5bc503c8-fed2-43e9-98dc-81ff876defe0",
    title: "Spicy Wings",
    text: "The Spiciest and Tastiest Wings You Will Find.",
    duration: 3000,
  },
  {
    uri: "https://firebasestorage.googleapis.com/v0/b/blazing-grills.appspot.com/o/files%2F10%20wings?alt=media&token=15a56271-c845-4532-8860-549e838c62b4",
    title: "Wings",
    text: "Tastiest On The Menu Worth A Try.",
    // fullWidth: true,
  },
];
const Sauces = [
  {
    uri: require("../assets/sauces1.jpeg"),
    title: "Concoction",
    text: "Strongest and tastiest sauce",
  },
  {
    uri: require("../assets/sauces2.jpeg"),
    title: "Courage",
    text: "Tastiest sauce",
    duration: 3000,
  },
  {
    uri: require("../assets/sauces3.jpeg"),
    title: "Insanity",
    text: "Strongest sauce",
    // fullWidth: true,
  },
];
const Fries = [
  {
    uri: "https://kaleem99.github.io/The-Blazing-Grill-Images/FriesSlider1.png",
    title: "Sauciest Fries",
    text: "Sauciest and Chilliest Fries you can find.",
  },
  {
    uri: "https://kaleem99.github.io/The-Blazing-Grill-Images/FriesSlider2.png",
    title: "Spiciest Fries",
    text: "Tastiest and Spiciest Fries",
    duration: 3000,
  },
  {
    uri: "https://kaleem99.github.io/The-Blazing-Grill-Images/FriesSlider3.png",
    title: "Fries On A Roll",
    text: "Best of both worlds.",
    // fullWidth: true,
  },
];
const Specials = [
  {
    uri: "https://kaleem99.github.io/The-Blazing-Grill-Images/SpecialsSlider1.png",
    title: "Pizza Wednesday",
    text: "Any 3 Pizzas",
  },
  {
    uri: "https://kaleem99.github.io/The-Blazing-Grill-Images/SpecialsSlider2.png",
    title: "Duo Box",
    text: "Chicken or Beef, why not both.",
    duration: 3000,
  },
  {
    uri: "https://kaleem99.github.io/The-Blazing-Grill-Images/SpecialsSlider3.png",
    title: "Monday Burger Nights",
    text: "2x Blazing Burgers and Fries.",
    // fullWidth: true,
  },
];
export { Pizza, Burgers, Chicken, SloppieJoe, Wings, Sauces, Fries, Specials };
