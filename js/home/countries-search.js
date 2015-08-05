require.config({

  baseUrl: 'js/dashboard',

  paths: {
    jquery:     '../vendor/jquery/dist/jquery.min',
    underscore: '../vendor/underscore/underscore-min',
    backbone:   '../vendor/backbone/backbone-min',
    handlebars: '../vendor/handlebars/handlebars.amd.min',
    d3:         '../vendor/d3/d3',
    d3chart:    'helpers/chart',
    moment:     '../vendor/moment/min/moment.min',
    text:       '../vendor/text/text',
    'backbone-super': '../vendor/backbone-super/backbone-super/' +
      'backbone-super-min'
  },

  shim: {
    d3:   { exports: 'd3' }
  }

});

require([
  'underscore',
  'backbone',
], function(_, Backbone) {

  'use strict';

  var CountrySearch = Backbone.View.extend({

    el: '.choose-country',

    events: {
      'change': 'setCountry'
    },

  	initialize: function() {
      var option;
      this.getCountries().forEach(function(country) {
        option = document.createElement('option');
        option.value = country.iso;
        option.textContent = country.name;
        this.$el.append(option);
      }, this);
  	},

    setCountry: function(e) {
      window.location = '/dashboard.html#'+e.currentTarget.value;
    },

    getCountries: function() {
      return [
        {
          'name':'Afghanistan',
          'iso':'AFG'
        },
        {
          'name':'Aland',
          'iso':'ALA'
        },
        {
          'name':'Albania',
          'iso':'ALB'
        },
        {
          'name':'Algeria',
          'iso':'DZA'
        },
        {
          'name':'American Samoa',
          'iso':'ASM'
        },
        {
          'name':'Andorra',
          'iso':'AND'
        },
        {
          'name':'Angola',
          'iso':'AGO'
        },
        {
          'name':'Anguilla',
          'iso':'AIA'
        },
        {
          'name':'Antarctica',
          'iso':'ATA'
        },
        {
          'name':'Antigua and Barb.',
          'iso':'ATG'
        },
        {
          'name':'Argentina',
          'iso':'ARG'
        },
        {
          'name':'Armenia',
          'iso':'ARM'
        },
        {
          'name':'Aruba',
          'iso':'ABW'
        },
        {
          'name':'Ashmore and Cartier Is.',
          'iso':'-99'
        },
        {
          'name':'Australia',
          'iso':'AUS'
        },
        {
          'name':'Austria',
          'iso':'AUT'
        },
        {
          'name':'Azerbaijan',
          'iso':'AZE'
        },
        {
          'name':'Bahamas',
          'iso':'BHS'
        },
        {
          'name':'Bahrain',
          'iso':'BHR'
        },
        {
          'name':'Bangladesh',
          'iso':'BGD'
        },
        {
          'name':'Barbados',
          'iso':'BRB'
        },
        {
          'name':'Belarus',
          'iso':'BLR'
        },
        {
          'name':'Belgium',
          'iso':'BEL'
        },
        {
          'name':'Belize',
          'iso':'BLZ'
        },
        {
          'name':'Benin',
          'iso':'BEN'
        },
        {
          'name':'Bermuda',
          'iso':'BMU'
        },
        {
          'name':'Bhutan',
          'iso':'BTN'
        },
        {
          'name':'Bolivia',
          'iso':'BOL'
        },
        {
          'name':'Bosnia and Herz.',
          'iso':'BIH'
        },
        {
          'name':'Botswana',
          'iso':'BWA'
        },
        {
          'name':'Br. Indian Ocean Ter.',
          'iso':'IOT'
        },
        {
          'name':'Brazil',
          'iso':'BRA'
        },
        {
          'name':'British Virgin Is.',
          'iso':'VGB'
        },
        {
          'name':'Brunei',
          'iso':'BRN'
        },
        {
          'name':'Bulgaria',
          'iso':'BGR'
        },
        {
          'name':'Burkina Faso',
          'iso':'BFA'
        },
        {
          'name':'Burundi',
          'iso':'BDI'
        },
        {
          'name':'Cambodia',
          'iso':'KHM'
        },
        {
          'name':'Cameroon',
          'iso':'CMR'
        },
        {
          'name':'Canada',
          'iso':'CAN'
        },
        {
          'name':'Cape Verde',
          'iso':'CPV'
        },
        {
          'name':'Cayman Is.',
          'iso':'CYM'
        },
        {
          'name':'Central African Rep.',
          'iso':'CAF'
        },
        {
          'name':'Chad',
          'iso':'TCD'
        },
        {
          'name':'Chile',
          'iso':'CHL'
        },
        {
          'name':'China',
          'iso':'CHN'
        },
        {
          'name':'Colombia',
          'iso':'COL'
        },
        {
          'name':'Comoros',
          'iso':'COM'
        },
        {
          'name':'Congo',
          'iso':'COG'
        },
        {
          'name':'Cook Is.',
          'iso':'COK'
        },
        {
          'name':'Costa Rica',
          'iso':'CRI'
        },
        {
          'name':'Croatia',
          'iso':'HRV'
        },
        {
          'name':'Cuba',
          'iso':'CUB'
        },
        {
          'name':'Curaçao',
          'iso':'CUW'
        },
        {
          'name':'Cyprus',
          'iso':'CYP'
        },
        {
          'name':'Czech Rep.',
          'iso':'CZE'
        },
        {
          'name':'Côte d\'Ivoire',
          'iso':'CIV'
        },
        {
          'name':'Dem. Rep. Congo',
          'iso':'COD'
        },
        {
          'name':'Dem. Rep. Korea',
          'iso':'PRK'
        },
        {
          'name':'Denmark',
          'iso':'DNK'
        },
        {
          'name':'Djibouti',
          'iso':'DJI'
        },
        {
          'name':'Dominica',
          'iso':'DMA'
        },
        {
          'name':'Dominican Rep.',
          'iso':'DOM'
        },
        {
          'name':'Ecuador',
          'iso':'ECU'
        },
        {
          'name':'Egypt',
          'iso':'EGY'
        },
        {
          'name':'El Salvador',
          'iso':'SLV'
        },
        {
          'name':'Eq. Guinea',
          'iso':'GNQ'
        },
        {
          'name':'Eritrea',
          'iso':'ERI'
        },
        {
          'name':'Estonia',
          'iso':'EST'
        },
        {
          'name':'Ethiopia',
          'iso':'ETH'
        },
        {
          'name':'Faeroe Is.',
          'iso':'FRO'
        },
        {
          'name':'Falkland Is.',
          'iso':'FLK'
        },
        {
          'name':'Fiji',
          'iso':'FJI'
        },
        {
          'name':'Finland',
          'iso':'FIN'
        },
        {
          'name':'Fr. Polynesia',
          'iso':'PYF'
        },
        {
          'name':'Fr. S. Antarctic Lands',
          'iso':'ATF'
        },
        {
          'name':'France',
          'iso':'FRA'
        },
        {
          'name':'Gabon',
          'iso':'GAB'
        },
        {
          'name':'Gambia',
          'iso':'GMB'
        },
        {
          'name':'Georgia',
          'iso':'GEO'
        },
        {
          'name':'Germany',
          'iso':'DEU'
        },
        {
          'name':'Ghana',
          'iso':'GHA'
        },
        {
          'name':'Greece',
          'iso':'GRC'
        },
        {
          'name':'Greenland',
          'iso':'GRL'
        },
        {
          'name':'Grenada',
          'iso':'GRD'
        },
        {
          'name':'Guam',
          'iso':'GUM'
        },
        {
          'name':'Guatemala',
          'iso':'GTM'
        },
        {
          'name':'Guernsey',
          'iso':'GGY'
        },
        {
          'name':'Guinea',
          'iso':'GIN'
        },
        {
          'name':'Guinea-Bissau',
          'iso':'GNB'
        },
        {
          'name':'Guyana',
          'iso':'GUY'
        },
        {
          'name':'Haiti',
          'iso':'HTI'
        },
        {
          'name':'Heard I. and McDonald Is.',
          'iso':'HMD'
        },
        {
          'name':'Honduras',
          'iso':'HND'
        },
        {
          'name':'Hong Kong',
          'iso':'HKG'
        },
        {
          'name':'Hungary',
          'iso':'HUN'
        },
        {
          'name':'Iceland',
          'iso':'ISL'
        },
        {
          'name':'India',
          'iso':'IND'
        },
        {
          'name':'Indian Ocean Ter.',
          'iso':'-99'
        },
        {
          'name':'Indonesia',
          'iso':'IDN'
        },
        {
          'name':'Iran',
          'iso':'IRN'
        },
        {
          'name':'Iraq',
          'iso':'IRQ'
        },
        {
          'name':'Ireland',
          'iso':'IRL'
        },
        {
          'name':'Isle of Man',
          'iso':'IMN'
        },
        {
          'name':'Israel',
          'iso':'ISR'
        },
        {
          'name':'Italy',
          'iso':'ITA'
        },
        {
          'name':'Jamaica',
          'iso':'JAM'
        },
        {
          'name':'Japan',
          'iso':'JPN'
        },
        {
          'name':'Jersey',
          'iso':'JEY'
        },
        {
          'name':'Jordan',
          'iso':'JOR'
        },
        {
          'name':'Kazakhstan',
          'iso':'KAZ'
        },
        {
          'name':'Kenya',
          'iso':'KEN'
        },
        {
          'name':'Kiribati',
          'iso':'KIR'
        },
        {
          'name':'Korea',
          'iso':'KOR'
        },
        {
          'name':'Kosovo',
          'iso':'-99'
        },
        {
          'name':'Kuwait',
          'iso':'KWT'
        },
        {
          'name':'Kyrgyzstan',
          'iso':'KGZ'
        },
        {
          'name':'Lao PDR',
          'iso':'LAO'
        },
        {
          'name':'Latvia',
          'iso':'LVA'
        },
        {
          'name':'Lebanon',
          'iso':'LBN'
        },
        {
          'name':'Lesotho',
          'iso':'LSO'
        },
        {
          'name':'Liberia',
          'iso':'LBR'
        },
        {
          'name':'Libya',
          'iso':'LBY'
        },
        {
          'name':'Liechtenstein',
          'iso':'LIE'
        },
        {
          'name':'Lithuania',
          'iso':'LTU'
        },
        {
          'name':'Luxembourg',
          'iso':'LUX'
        },
        {
          'name':'Macao',
          'iso':'MAC'
        },
        {
          'name':'Macedonia',
          'iso':'MKD'
        },
        {
          'name':'Madagascar',
          'iso':'MDG'
        },
        {
          'name':'Malawi',
          'iso':'MWI'
        },
        {
          'name':'Malaysia',
          'iso':'MYS'
        },
        {
          'name':'Maldives',
          'iso':'MDV'
        },
        {
          'name':'Mali',
          'iso':'MLI'
        },
        {
          'name':'Malta',
          'iso':'MLT'
        },
        {
          'name':'Marshall Is.',
          'iso':'MHL'
        },
        {
          'name':'Mauritania',
          'iso':'MRT'
        },
        {
          'name':'Mauritius',
          'iso':'MUS'
        },
        {
          'name':'Mexico',
          'iso':'MEX'
        },
        {
          'name':'Micronesia',
          'iso':'FSM'
        },
        {
          'name':'Moldova',
          'iso':'MDA'
        },
        {
          'name':'Monaco',
          'iso':'MCO'
        },
        {
          'name':'Mongolia',
          'iso':'MNG'
        },
        {
          'name':'Montenegro',
          'iso':'MNE'
        },
        {
          'name':'Montserrat',
          'iso':'MSR'
        },
        {
          'name':'Morocco',
          'iso':'MAR'
        },
        {
          'name':'Mozambique',
          'iso':'MOZ'
        },
        {
          'name':'Myanmar',
          'iso':'MMR'
        },
        {
          'name':'N. Cyprus',
          'iso':'-99'
        },
        {
          'name':'N. Mariana Is.',
          'iso':'MNP'
        },
        {
          'name':'Namibia',
          'iso':'NAM'
        },
        {
          'name':'Nauru',
          'iso':'NRU'
        },
        {
          'name':'Nepal',
          'iso':'NPL'
        },
        {
          'name':'Netherlands',
          'iso':'NLD'
        },
        {
          'name':'New Caledonia',
          'iso':'NCL'
        },
        {
          'name':'New Zealand',
          'iso':'NZL'
        },
        {
          'name':'Nicaragua',
          'iso':'NIC'
        },
        {
          'name':'Niger',
          'iso':'NER'
        },
        {
          'name':'Nigeria',
          'iso':'NGA'
        },
        {
          'name':'Niue',
          'iso':'NIU'
        },
        {
          'name':'Norfolk Island',
          'iso':'NFK'
        },
        {
          'name':'Norway',
          'iso':'NOR'
        },
        {
          'name':'Oman',
          'iso':'OMN'
        },
        {
          'name':'Pakistan',
          'iso':'PAK'
        },
        {
          'name':'Palau',
          'iso':'PLW'
        },
        {
          'name':'Palestine',
          'iso':'PSE'
        },
        {
          'name':'Panama',
          'iso':'PAN'
        },
        {
          'name':'Papua New Guinea',
          'iso':'PNG'
        },
        {
          'name':'Paraguay',
          'iso':'PRY'
        },
        {
          'name':'Peru',
          'iso':'PER'
        },
        {
          'name':'Philippines',
          'iso':'PHL'
        },
        {
          'name':'Pitcairn Is.',
          'iso':'PCN'
        },
        {
          'name':'Poland',
          'iso':'POL'
        },
        {
          'name':'Portugal',
          'iso':'PRT'
        },
        {
          'name':'Puerto Rico',
          'iso':'PRI'
        },
        {
          'name':'Qatar',
          'iso':'QAT'
        },
        {
          'name':'Romania',
          'iso':'ROU'
        },
        {
          'name':'Russia',
          'iso':'RUS'
        },
        {
          'name':'Rwanda',
          'iso':'RWA'
        },
        {
          'name':'S. Geo. and S. Sandw. Is.',
          'iso':'SGS'
        },
        {
          'name':'S. Sudan',
          'iso':'SSD'
        },
        {
          'name':'Saint Helena',
          'iso':'SHN'
        },
        {
          'name':'Saint Lucia',
          'iso':'LCA'
        },
        {
          'name':'Samoa',
          'iso':'WSM'
        },
        {
          'name':'San Marino',
          'iso':'SMR'
        },
        {
          'name':'Saudi Arabia',
          'iso':'SAU'
        },
        {
          'name':'Senegal',
          'iso':'SEN'
        },
        {
          'name':'Serbia',
          'iso':'SRB'
        },
        {
          'name':'Seychelles',
          'iso':'SYC'
        },
        {
          'name':'Siachen Glacier',
          'iso':'-99'
        },
        {
          'name':'Sierra Leone',
          'iso':'SLE'
        },
        {
          'name':'Singapore',
          'iso':'SGP'
        },
        {
          'name':'Sint Maarten',
          'iso':'SXM'
        },
        {
          'name':'Slovakia',
          'iso':'SVK'
        },
        {
          'name':'Slovenia',
          'iso':'SVN'
        },
        {
          'name':'Solomon Is.',
          'iso':'SLB'
        },
        {
          'name':'Somalia',
          'iso':'SOM'
        },
        {
          'name':'Somaliland',
          'iso':'-99'
        },
        {
          'name':'South Africa',
          'iso':'ZAF'
        },
        {
          'name':'Spain',
          'iso':'ESP'
        },
        {
          'name':'Sri Lanka',
          'iso':'LKA'
        },
        {
          'name':'St-Barthélemy',
          'iso':'BLM'
        },
        {
          'name':'St-Martin',
          'iso':'MAF'
        },
        {
          'name':'St. Kitts and Nevis',
          'iso':'KNA'
        },
        {
          'name':'St. Pierre and Miquelon',
          'iso':'SPM'
        },
        {
          'name':'St. Vin. and Gren.',
          'iso':'VCT'
        },
        {
          'name':'Sudan',
          'iso':'SDN'
        },
        {
          'name':'Suriname',
          'iso':'SUR'
        },
        {
          'name':'Swaziland',
          'iso':'SWZ'
        },
        {
          'name':'Sweden',
          'iso':'SWE'
        },
        {
          'name':'Switzerland',
          'iso':'CHE'
        },
        {
          'name':'Syria',
          'iso':'SYR'
        },
        {
          'name':'Săo Tomé and Principe',
          'iso':'STP'
        },
        {
          'name':'Taiwan',
          'iso':'TWN'
        },
        {
          'name':'Tajikistan',
          'iso':'TJK'
        },
        {
          'name':'Tanzania',
          'iso':'TZA'
        },
        {
          'name':'Thailand',
          'iso':'THA'
        },
        {
          'name':'Timor-Leste',
          'iso':'TLS'
        },
        {
          'name':'Togo',
          'iso':'TGO'
        },
        {
          'name':'Tonga',
          'iso':'TON'
        },
        {
          'name':'Trinidad and Tobago',
          'iso':'TTO'
        },
        {
          'name':'Tunisia',
          'iso':'TUN'
        },
        {
          'name':'Turkey',
          'iso':'TUR'
        },
        {
          'name':'Turkmenistan',
          'iso':'TKM'
        },
        {
          'name':'Turks and Caicos Is.',
          'iso':'TCA'
        },
        {
          'name':'U.S. Virgin Is.',
          'iso':'VIR'
        },
        {
          'name':'Uganda',
          'iso':'UGA'
        },
        {
          'name':'Ukraine',
          'iso':'UKR'
        },
        {
          'name':'United Arab Emirates',
          'iso':'ARE'
        },
        {
          'name':'United Kingdom',
          'iso':'GBR'
        },
        {
          'name':'United States',
          'iso':'USA'
        },
        {
          'name':'Uruguay',
          'iso':'URY'
        },
        {
          'name':'Uzbekistan',
          'iso':'UZB'
        },
        {
          'name':'Vanuatu',
          'iso':'VUT'
        },
        {
          'name':'Vatican',
          'iso':'VAT'
        },
        {
          'name':'Venezuela',
          'iso':'VEN'
        },
        {
          'name':'Vietnam',
          'iso':'VNM'
        },
        {
          'name':'W. Sahara',
          'iso':'ESH'
        },
        {
          'name':'Wallis and Futuna Is.',
          'iso':'WLF'
        },
        {
          'name':'Yemen',
          'iso':'YEM'
        },
        {
          'name':'Zambia',
          'iso':'ZMB'
        },
        {
          'name':'Zimbabwe',
          'iso':'ZWE'
        }
      ];
    }

  });

  new CountrySearch();

});