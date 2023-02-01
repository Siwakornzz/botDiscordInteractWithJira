const text = "!register phangsagon phongsgon";

console.log(text.split("!register ").splice(1).toString());
console.log(text.replace("!register", "").trim());
