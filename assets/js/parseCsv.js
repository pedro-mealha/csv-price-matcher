export function CSVToArray(strData, strDelimiter) {
    strDelimiter = (strDelimiter || ",");
    const objPattern = new RegExp(
        (
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + // Delimiters
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + // Quoted fields
            "([^\"\\" + strDelimiter + "\\r\\n]*))" // Standard fields
        ),
        "gi"
    );

    const arrData = [[]];
    let arrMatches = null;

    // eslint-disable-next-line no-cond-assign
    while (arrMatches = objPattern.exec(strData)){
        let strMatchedValue = '';

        const strMatchedDelimiter = arrMatches[1];
        if (strMatchedDelimiter.length && (strMatchedDelimiter != strDelimiter)) {
            arrData.push([]);
        }

        if (arrMatches[2]) {
            strMatchedValue = arrMatches[2].replace(new RegExp("\"\"", "g" ), "\"");
        } else {
            strMatchedValue = arrMatches[3];
        }

        arrData[arrData.length - 1].push(strMatchedValue);
    }

    return arrData;
}
