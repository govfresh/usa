var request = new XMLHttpRequest();
request.open('GET', 'https://raw.githubusercontent.com/cisagov/dotgov-data/main/current-full.csv');
request.onload = function () {
    var response = this.response.slice(77).split('\n');
    var usedBys = this.response.slice(77).split('\n');
    for (let i = 0; i < usedBys.length; i++)
        usedBys[i] = usedBys[i].slice(usedBys[i].indexOf(',', usedBys[i].indexOf(',', usedBys[i].indexOf(',') + 1) + 1) + 1);
    for (let o = 0; o < usedBys.length; o++)
        usedBys[o] = usedBys[o].slice(0, usedBys[o].indexOf(usedBys[o].indexOf(',') + 1));
    for (let i = 0; i < response.length; i++)
        response[i] = response[i].slice(0, response[i].indexOf('.GOV') + 4);
    var input = document.querySelector('input.search-domains');
    var legalCharacters =
        '0 1 2 3 4 5 6 7 8 9 a b c d e f g h i j k l m n o p q r s t u v w x y z A B C D E F G H I J K L M N O P Q R S T U V W X Y Z . /'
            .split(' ');
    input.parentElement.parentElement.onsubmit = function () {
        var isValidUrl = true;
        input.value.split('').forEach(character => {
            if (isValidUrl)
                isValidUrl = legalCharacters.includes(character);
        });
        var result = document.querySelector('div.url-result');
        if (input.value.includes('.'))
            input.value = input.value.slice(0, input.value.indexOf('.'));
        if (!input.value.includes('.gov'))
            input.value = input.value.concat('.gov');
        if (!isValidUrl)
            result.innerHTML = '<div class="alert alert-danger" role="alert"><i class="fas fa-times-circle"></i> '.concat(input.value
                .concat(' is not a valid url.')).concat('</div>');
        else
            result.innerHTML = (response.includes(input.value.toUpperCase())) ?
                '<div class="alert alert-danger" role="alert"><i class="fas fa-times-circle"></i> '.concat(input.value.concat(
                    ' is not available. Try a new search.')).concat('</div>') :
                '<div class="alert alert-success" role="alert"><i class="fas fa-check-circle"></i> '.concat(input
                    .value.concat(' is available! Go .gov and <a target="_blank" href="https://home.dotgov.gov/registration/">get the '.concat(input.value).concat(' domain.</a>')));
        return false;
    }
};
request.send();