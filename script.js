
(async function(){
  const map = new maplibregl.Map({
    container:'map',
    style:'https://demotiles.maplibre.org/style.json',
    center:[0,15], zoom:2
  });

  async function load(name){ const res=await fetch(`../atlas/${name}.geojson`); return await res.json(); }
  const [continents,countries,cities]=await Promise.all([load('continents'),load('countries'),load('cities')]);

  map.on('load',()=>{
    // Continents
    map.addSource('continents',{type:'geojson',data:continents});
    map.addLayer({id:'continents-fill',type:'fill',source:'continents',
      paint:{'fill-color':['coalesce',['get',['to-string',['get','style']],'fill'],'#c8a36a'],'fill-opacity':0.6}});
    map.addLayer({id:'continents-line',type:'line',source:'continents',paint:{'line-color':'#5a4633','line-width':1.4}});

    // Countries
    map.addSource('countries',{type:'geojson',data:countries});
    map.addLayer({id:'countries-fill',type:'fill',source:'countries',paint:{
      'fill-color':['match',['get','gov_style'],
        'federal','#D0E6A5','republic','#FFDD94','monarchy','#C9C9FF','#E6E6E6'],
      'fill-opacity':0.5}});
    map.addLayer({id:'countries-line',type:'line',source:'countries',paint:{'line-color':'#333','line-width':1}});

    // Cities
    map.addSource('cities',{type:'geojson',data:cities});
    map.addLayer({id:'cities',type:'circle',source:'cities',paint:{
      'circle-radius':4,
      'circle-stroke-width':1,
      'circle-stroke-color':'#fff',
      'circle-color':['match',['get','kind'],'capital','#cc3333','port','#3388cc','industrial','#666','#222']
    }});

    // Interactions
    map.on('click','continents-fill',e=>alert('Continent: '+e.features[0].properties.name));
    map.on('click','countries-fill',e=>alert('Country: '+e.features[0].properties.name+' ('+e.features[0].properties.gov_style+')'));
    map.on('click','cities',e=>alert('City: '+e.features[0].properties.name));
  });
})();
