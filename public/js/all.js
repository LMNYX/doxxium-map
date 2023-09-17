window.onload = async () =>
{
    const retardData = await fetch('/data/everyone.json');
    const retardsJson = await retardData.json();

    let countriesAmount = Object.keys(retardsJson).length;

    document.getElementById('__total_countries').innerHTML = countriesAmount;
    
    let retardCount = 0;

    for (let country in retardsJson)
    {
        retardCount += retardsJson[country].length;
    }

    document.getElementById('__total_retards').innerHTML = retardCount;

    const width = 900;
    const height = 600;

    const svg = d3.select('.container').append('svg').attr('width', width).attr('height', height);

    const projection = d3.geoMercator().scale(130).translate([width / 2, height / 2]);

    const path = d3.geoPath(projection);

    const g = svg.append('g');

    const zoom = d3.zoom()
        .scaleExtent([1, 8]) // Define the zoom scale limits
        .on('zoom', zoomed);

    svg.call(zoom);

    function zoomed(event) {
        g.selectAll('path')
            .attr('transform', event.transform); // Apply the transform to paths
    }

    d3.json('https://raw.githubusercontent.com/dd1b/topojson_world_map/master/world-110m.json').then(data => {
        const countries = topojson.feature(data, data.objects.countries);

        g.selectAll('path').data(countries.features).enter().append('path').attr('class', d => {
            let classList = [];
            classList.push('country');

            if (d.properties.name in retardsJson)
                classList.push('retards-spotted');

            return classList.join(' ');
        }).attr('d', path).attr('data-name', d => d.properties.name).attr('data-id', d => d.id).on('mouseover', function(d, i) {
            d3.select(this).classed('active', true);

            displayRetards(this);
        }).on('mouseout', function(d, i)
        {
            d3.select(this).classed('active', false);
        }).attr('data-tippy-content', d => {
            let content = d.properties.name;

            if (d.properties.name in retardsJson)
                content += ' - ' + retardsJson[d.properties.name].length + ' retard(s) spotted';

            return content;
        }).attr('data-amount', d => {
            if (d.properties.name in retardsJson)
            {
                let amountOf = retardsJson[d.properties.name].length;
                if (amountOf > 5)
                    amountOf = "more";

                return amountOf;
            }
        }).attr('data-retards', d => {
            if (d.properties.name in retardsJson)
            {
                let retards = JSON.stringify(retardsJson[d.properties.name]);

                return retards;
            }
        });

        tippy('.country');
    });
}

function displayRetards(v)
{
    let retards = v.getAttribute('data-retards');
    let retardDisplay = document.getElementById("__retards_display");
    try
    {
        retards = JSON.parse(retards);
    } catch
    {
        retardDisplay.innerHTML = "<span class='emote-text'>There is no one in this country.</span> <img src='https://cdn.7tv.app/emote/614e96dd6251d7e000da7d22/2x.webp' class='emote'>";
        return;
    }

    if (!retards || retards == null || retards.length < 1)
    {
        retardDisplay.innerHTML = "<span class='emote-text'>There is no one in this country.</span> <img src='https://cdn.7tv.app/emote/614e96dd6251d7e000da7d22/2x.webp' class='emote'>";
        return;
    }

    retardDisplay.innerHTML = "";

    for (var i = 0; i < retards.length; i++)
    {
        let newRetard = document.createElement('div');
        let circle = document.createElement('div');
        let name = document.createElement('span');

        name.innerHTML = retards[i];
        circle.classList.add('circle');

        newRetard.appendChild(circle);
        newRetard.appendChild(name);

        newRetard.classList.add("retard-card");

        retardDisplay.appendChild(newRetard);
    }
    
}