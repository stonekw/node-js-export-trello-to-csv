const json = require('./trello.json');
const { Parser } = require('json2csv');
const fs = require('fs');

const effortRegex = RegExp("(([^)]+))");
const productbackloglistid = "5e5472bfcf9ca5535ccb4300";
const cardFields = [
    //"id",
    {
        label:"Priority",
        value:"order"
    },
    {
        label:"Name",
        value:"name"
    },
    {
        label:"Actor(s)",
        value: (row) => {
            return row.labels.map((label) => label.name).join(';');
        },
        default:""
    },

    {
        label:"Estimation",
        value: (row) => {
            let match = row.name.match(effortRegex);
            return match ? match[0].replace("(","") : null;
        },
        default:""
    }
];
let cards = getCardsByListId(productbackloglistid);
exportCardsToCsv(cards,cardFields,"c:/scripts/trello.csv");
function exportCardsToCsv(cards, fields, path)
{
    let parser = new Parser({fields});
    let csv = parser.parse(cards);
    fs.writeFile(path, csv, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    }); 
}
function getCardsByListId(listId, includeClosed)
{
    let cards = json.cards;
    let toReturn = [];
    let order = 0;
    includeClosed = includeClosed || false;
    cards.map((card) => {
        if (card.idList == listId){
            if (!(card.closed == true && includeClosed == false)){
                order++;
                card["order"] = order;
                toReturn.push(card);
            }
        }
    });
    return toReturn;
}

