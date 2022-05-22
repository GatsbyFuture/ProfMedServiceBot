const data = {
    __EMPTY_19: "1320000",
    __EMPTY_20: "120000",
    __EMPTY_23: undefined,
    __EMPTY_24: "120000",
    __EMPTY_25: "420000",
    __EMPTY_26: "120000",
    __EMPTY_27: "120000",
    __EMPTY_28: "120000",
}
let debt = 0;
for (let key in data) {
    if (key == "__EMPTY_25" || key == "__EMPTY_23" || key == "__EMPTY_19") {
        debt = debt + parseInt(data[key] == undefined ? 0 : data[key]);
    }
}
// console.log(debt.toString());
String.prototype.insert = function (index, string) {
    var ind = index < 0 ? this.length + index : index;
    return this.substring(0, ind) + string + this.substring(ind);
};
let text = {
    summa: "75000",
    summ1: "1250000"
};

for (let key in text) {
    if (text[key].length > 3 && text[key].length <= 6) {
        text[key] = text[key].insert(-3, " ")
    }
    if (text[key].length >= 7) {
        text[key] = text[key].insert(-3, " ").insert(-7, " ")
    }
}
console.log(text);
