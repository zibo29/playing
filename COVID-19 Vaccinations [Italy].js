// start of the script, do not modify
const today = new Date();
let result
let widget = new ListWidget()
widget.setPadding(8, 8, 8, 8)
const apiUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/Italy.csv"

await getNumbers()
await createWidget()
Script.setWidget(widget)
Script.complete()


if (config.runsInApp) {
    widget.presentSmall()

}

async function createWidget() {
    let day = today.getDate().toString()

    //choose widget background color (use HEX) or just delete row for a black bg
    widget.backgroundColor = new Color("#2C2C2E")

    const upperStack = widget.addStack()
    upperStack.layoutHorizontally()

    let image = await getImage('vaccination-logo.png')

    let logoImage = upperStack.addImage(image)
    logoImage.imageSize = new Size(60, 60)

    upperStack.addSpacer(12)

    let calendarStack = upperStack.addStack()
    calendarStack.layoutVertically()
    calendarStack.addSpacer(4)
    let dayNameText = calendarStack.addText(getWeekday(today).toUpperCase())
    dayNameText.textColor = Color.red()
    if (getWeekday(today) === "Thursday") {
        dayNameText.font = Font.boldSystemFont(10)
    } else {
        dayNameText.font = Font.boldSystemFont(10)
    }

    let spacer = "   "
    if (day < 10) {
        spacer = "    "
    }
    let dayText = calendarStack.addText(spacer + day)
    dayText.font = Font.semiboldSystemFont(26)

    let dateText = calendarStack.addText(getMonthName(today))
    dateText.font = Font.boldSystemFont(11)

    widget.addSpacer(8)

//amount of people vaccinated - obtain data
    const data = await new Request(apiUrl).loadString();
    var csv=data;
    var lines=csv.split("\n");
      var result = [];
      var headers=lines[0].split(",");
      for(var i=1;i<lines.length;i++){
    	  var obj = {};
    	  var currentline=lines[i].split(",");
    	  for(var j=0;j<headers.length;j++){
    		  obj[headers[j]] = currentline[j];
    	  }
    	  result.push(obj);
      }
      csv=JSON.stringify(result);
      var datacsv = JSON.parse(csv);
    const list = new ListWidget()
    	var vaccinati=datacsv[datacsv.length-2].total_vaccinations;
    //here it displays the obtained data

//% of people vaccinated
      var vaccinati_pro = vaccinati/60360000*100;
      vaccinati_pro=vaccinati_pro.toFixed(2);
    let staticText = widget.addText("Vaccinated:")
    staticText.font = Font.boldSystemFont(11)

//display of people vaccinated and % of population vaccinated - how to write in smaller the part after the dash?
    let amountText = widget.addText(vaccinati.toLocaleString() + " \(" + (vaccinati_pro.toLocaleString() + "%\)"))
    amountText.font = Font.boldSystemFont(14)
    widget.addSpacer(3)

    label = list.addText("Stand: ");
      label.font = Font.boldSystemFont(10);
      label.textColor = Device.isUsingDarkAppearance() ? Color.white() : Color.black();

  let lastUpdatedText = widget.addText("Date: " + datacsv[datacsv.length-2].date);
  lastUpdatedText.textColor = Color.gray()
  lastUpdatedText.font = Font.mediumSystemFont(10)
}

function getWeekday(date) {
    var weekday = new Array(7);
    weekday[0] = "  Sunday";
    weekday[1] = "  Monday";
    weekday[2] = " Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "   Friday";
    weekday[6] = " Saturday";

    return weekday[date.getDay()];
}

function getMonthName(date) {
    var monthName = new Array(12);
    monthName[0] = "   January";
    monthName[1] = "  February";
    monthName[2] = "     March";
    monthName[3] = "     April";
    monthName[4] = "       May";
    monthName[5] = "      June";
    monthName[6] = "      July";
    monthName[7] = "    August";
    monthName[8] = " September";
    monthName[9] = "   October";
    monthName[10] = "  November";
    monthName[11] = "  December";

    return monthName[date.getMonth()];
}

// get images or download them once
async function getImage(image) {
    let fm = FileManager.local()
    let dir = fm.documentsDirectory()
    let path = fm.joinPath(dir, image)
    if (fm.fileExists(path)) {
        return fm.readImage(path)
    } else {
        // download once
        let imageUrl
        switch (image) {
            case 'vaccination-logo.png':
                imageUrl = "https://cdn2.iconfinder.com/data/icons/corona-virus-covid-19-14/512/9_Flu_protection_vaccine_virus-512.png"
                break
            default:
                console.log(`Sorry, couldn't find ${image}.`);
        }
        let req = new Request(imageUrl)
        let loadedImage = await req.loadImage()
        fm.writeImage(path, loadedImage)
        return loadedImage
    }
}

async function getNumbers() {
    // Set up the file manager.
    const files = FileManager.local()

}

// thanks to /u/wind-wars and github.com/marco79cgn for ispiration, help and most of the code
// thanks to "our world in data" github for the data
// you can add "open URL" on Scriptable widget to this site: "https://app.powerbi.com/view?r=eyJrIjoiMzg4YmI5NDQtZDM5ZC00ZTIyLTgxN2MtOTBkMWM4MTUyYTg0IiwidCI6ImFmZDBhNzVjLTg2NzEtNGNjZS05MDYxLTJjYTBkOTJlNDIyZiIsImMiOjh9"
// ... for more updated data
//it's my first js so there will be mistakes

//made with <3 by bomba_isntmynm /u/zibo29
