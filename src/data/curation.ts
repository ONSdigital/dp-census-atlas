export default [
	{
		code: 'Education',
		name: 'Education',
		slug: 'education',
		desc: 'Residents in education and qualifications they hold.',
		variables: [
			{
				categories: [
					{ code: 'QS501EW0002', name: 'No qualifications', slug: 'no-qualifications' },
					{ code: 'QS501EW0003', name: 'Level 1 qualifications', slug: 'level-1-qualifications' },
					{ code: 'QS501EW0004', name: 'Level 2 qualifications', slug: 'level-2-qualifications' },
					{ code: 'QS501EW0005', name: 'Apprenticeship', slug: 'apprenticeship' },
					{ code: 'QS501EW0006', name: 'Level 3 qualifications', slug: 'level-3-qualifications' },
					{
						code: 'QS501EW0007',
						name: 'Level 4 qualifications and above',
						slug: 'level-4-qualifications-and-above'
					},
					{ code: 'QS501EW0008', name: 'Other qualifications', slug: 'other-qualifications' }
				],
				code: 'QS501EW',
				name: 'Highest level of qualification gained',
				slug: 'highest-level-of-qualification-gained',
				desc: 'Highest qualification gained by residents.',
				total: {
					code: 'QS501EW0001',
					name: 'All categories: Highest level of qualification',
					slug: 'all-categories-highest-level-of-qualification'
				},
				units: 'People',
				joiner: 'who have'
			}
		]
	},
	{
		code: 'Health',
		name: 'Health',
		slug: 'health',
		desc: 'General health and caring responsibilities.',
		variables: [
			{
				categories: [
					{ code: 'QS302EW0002', name: 'Very good', slug: 'very-good' },
					{ code: 'QS302EW0003', name: 'Good', slug: 'good' },
					{ code: 'QS302EW0004', name: 'Fair', slug: 'fair' },
					{ code: 'QS302EW0005', name: 'Bad', slug: 'bad' },
					{ code: 'QS302EW0006', name: 'Very bad', slug: 'very-bad' }
				],
				code: 'QS302EW',
				name: 'General health',
				slug: 'general-health',
				desc: 'How people rate their general health.',
				total: {
					code: 'QS302EW0001',
					name: 'All categories: General health',
					slug: 'all-categories-general-health'
				},
				units: 'People'
			},
			{
				categories: [
					{
						code: 'QS303EW0002',
						name: 'Day-to-day activities limited a lot',
						slug: 'day-to-day-activities-limited-a-lot'
					},
					{
						code: 'QS303EW0003',
						name: 'Day-to-day activities limited a little',
						slug: 'day-to-day-activities-limited-a-little'
					},
					{
						code: 'QS303EW0004',
						name: 'Day-to-day activities are not limited',
						slug: 'day-to-day-activities-are-not-limited'
					}
				],
				code: 'QS303EW',
				name: 'Long-term health problem or disability',
				slug: 'long-term-health-problem-or-disability',
				desc: "How people's health affects their day-to-day activities.",
				total: {
					code: 'QS303EW0001',
					name: 'All categories: Long-term health problem or disability',
					slug: 'all-categories-long-term-health-problem-or-disability'
				},
				units: 'People'
			},
			{
				categories: [
					{
						code: 'QS301EW0002',
						name: 'Does not provide unpaid care',
						slug: 'does-not-provide-unpaid-care'
					},
					{
						code: 'QS301EW0003',
						name: 'Provides 1 to 19 hours unpaid care a week',
						slug: 'provides-1-to-19-hours-unpaid-care-a-week'
					},
					{
						code: 'QS301EW0004',
						name: 'Provides 20 to 49 hours unpaid care a week',
						slug: 'provides-20-to-49-hours-unpaid-care-a-week'
					},
					{
						code: 'QS301EW0005',
						name: 'Provides 50 or more hours unpaid care a week',
						slug: 'provides-50-or-more-hours-unpaid-care-a-week'
					}
				],
				code: 'QS301EW',
				name: 'Unpaid care ',
				slug: 'unpaid-care',
				desc: 'People who provide unpaid care.',
				total: {
					code: 'QS301EW0001',
					name: 'All categories: Provision of unpaid care',
					slug: 'all-categories-provision-of-unpaid-care'
				},
				units: 'People'
			}
		]
	},
	{
		code: 'Housing',
		name: 'Housing',
		slug: 'housing',
		desc: 'Types of homes and the people living in them.',
		variables: [
			{
				categories: [
					{ code: 'QS406EW0002', name: '1 person household', slug: '1-person-household' },
					{ code: 'QS406EW0003', name: '2 person household', slug: '2-person-household' },
					{ code: 'QS406EW0004', name: '3 person household', slug: '3-person-household' },
					{ code: 'QS406EW0005', name: '4 person household', slug: '4-person-household' },
					{ code: 'QS406EW0006', name: '5 person household', slug: '5-person-household' },
					{
						code: 'QS406EW0009',
						name: '6 or more people in household',
						slug: '6-or-more-people-in-household'
					}
				],
				code: 'QS406EW',
				name: 'Size of household',
				slug: 'size-of-household',
				desc: 'How many people living in the same home.',
				total: {
					code: 'QS406EW0001',
					name: 'All categories: Household size',
					slug: 'all-categories-household-size'
				},
				units: 'Households'
			},
			{
				categories: [
					{ code: 'KS402EW0002', name: 'Owned: Owned outright', slug: 'owned-owned-outright' },
					{
						code: 'KS402EW0003',
						name: 'Owned: Owned with a mortgage or loan',
						slug: 'owned-owned-with-a-mortgage-or-loan'
					},
					{ code: 'KS402EW0004', name: 'Shared ownership', slug: 'shared-ownership' },
					{
						code: 'KS402EW0005',
						name: 'Social rent: Rented from council (Local Authority)',
						slug: 'social-rent-rented-from-council-local-authority'
					},
					{
						code: 'KS402EW0006',
						name: 'Social rent: Other social rented',
						slug: 'social-rent-other-social-rented'
					},
					{
						code: 'KS402EW0007',
						name: 'Private rented: Private landlord or letting agency',
						slug: 'private-rented-private-landlord-or-letting-agency'
					},
					{ code: 'KS402EW0008', name: 'Private rented: Other', slug: 'private-rented-other' }
				],
				code: 'KS402EW',
				name: 'Owned and renting',
				slug: 'owned-and-renting',
				desc: 'People that live in a home they rent or own.',
				total: {
					code: 'KS402EW0001',
					name: 'All categories: Tenure',
					slug: 'all-categories-tenure'
				},
				units: 'Households'
			},
			{
				categories: [
					{
						code: 'QS416EW0002',
						name: 'No cars or vans available',
						slug: 'no-cars-or-vans-available'
					},
					{ code: 'QS416EW0003', name: '1 car or van', slug: '1-car-or-van' },
					{ code: 'QS416EW0004', name: '2 cars or vans', slug: '2-cars-or-vans' },
					{
						code: 'QS416EW0006',
						name: '3 or more cars or vans available',
						slug: '3-or-more-cars-or-vans-available'
					}
				],
				code: 'QS416EW',
				name: 'Car or van availability',
				slug: 'car-or-van-availability',
				desc: 'People that have access to cars or vans.',
				total: {
					code: 'QS416EW0001',
					name: 'All categories: Car or van availability',
					slug: 'all-categories-car-or-van-availability'
				},
				units: 'Households'
			},
			{
				categories: [
					{ code: 'QS415EW0002', name: 'No central heating', slug: 'no-central-heating' },
					{ code: 'QS415EW0003', name: 'Gas', slug: 'gas' },
					{
						code: 'QS415EW0004',
						name: 'Electric (including storage heaters)',
						slug: 'electric-including-storage-heaters'
					},
					{ code: 'QS415EW0005', name: 'Oil', slug: 'oil' },
					{
						code: 'QS415EW0006',
						name: 'Solid fuel (for example wood, coal)',
						slug: 'solid-fuel-for-example-wood-coal'
					},
					{ code: 'QS415EW0007', name: 'Other central heating', slug: 'other-central-heating' },
					{
						code: 'QS415EW0008',
						name: 'Two or more types of central heating',
						slug: 'two-or-more-types-of-central-heating'
					}
				],
				code: 'QS415EW',
				name: 'Heating',
				slug: 'heating',
				desc: 'Types of central heating',
				total: {
					code: 'QS415EW0001',
					name: 'All categories: Type of central heating in household',
					slug: 'all-categories-type-of-central-heating-in-household'
				},
				units: 'Households'
			},
			{
				categories: [
					{ code: 'QS411EW0002', name: 'No dedicated bedroom', slug: 'no-dedicated-bedroom' },
					{ code: 'QS411EW0003', name: '1 bedroom', slug: '1-bedroom' },
					{ code: 'QS411EW0004', name: '2 bedrooms', slug: '2-bedrooms' },
					{ code: 'QS411EW0005', name: '3 bedrooms', slug: '3-bedrooms' },
					{ code: 'QS411EW0006', name: '4 bedrooms', slug: '4-bedrooms' },
					{ code: 'QS411EW0007', name: '5 or more bedrooms', slug: '5-or-more-bedrooms' }
				],
				code: 'QS411EW',
				name: 'Number of bedrooms',
				slug: 'number-of-bedrooms',
				desc: 'How many bedrooms in a home.',
				total: {
					code: 'QS411EW0001',
					name: 'All categories: Number of bedrooms',
					slug: 'all-categories-number-of-bedrooms'
				},
				units: 'Households'
			}
		]
	},
	{
		code: 'Identity',
		name: 'Identity',
		slug: 'identity',
		desc: 'How residents identify themselves and their beliefs.',
		variables: [
			{
				categories: [
					{
						code: 'QS201EW0002',
						name: 'White: English/Welsh/Scottish/Northern Irish/British',
						slug: 'white-english-welsh-scottish-northern-irish-british'
					},
					{ code: 'QS201EW0003', name: 'White: Irish', slug: 'white-irish' },
					{
						code: 'QS201EW0004',
						name: 'White: Gypsy or Irish Traveller',
						slug: 'white-gypsy-or-irish-traveller'
					},
					{ code: 'QS201EW0005', name: 'White: Other White', slug: 'white-other-white' },
					{
						code: 'QS201EW0006',
						name: 'Mixed/multiple ethnic group: White and Black Caribbean',
						slug: 'mixed-multiple-ethnic-group-white-and-black-caribbean'
					},
					{
						code: 'QS201EW0007',
						name: 'Mixed/multiple ethnic group: White and Black African',
						slug: 'mixed-multiple-ethnic-group-white-and-black-african'
					},
					{
						code: 'QS201EW0008',
						name: 'Mixed/multiple ethnic group: White and Asian',
						slug: 'mixed-multiple-ethnic-group-white-and-asian'
					},
					{
						code: 'QS201EW0009',
						name: 'Mixed/multiple ethnic group: Other Mixed',
						slug: 'mixed-multiple-ethnic-group-other-mixed'
					},
					{
						code: 'QS201EW0010',
						name: 'Asian/Asian British: Indian',
						slug: 'asian-asian-british-indian'
					},
					{
						code: 'QS201EW0011',
						name: 'Asian/Asian British: Pakistani',
						slug: 'asian-asian-british-pakistani'
					},
					{
						code: 'QS201EW0012',
						name: 'Asian/Asian British: Bangladeshi',
						slug: 'asian-asian-british-bangladeshi'
					},
					{
						code: 'QS201EW0013',
						name: 'Asian/Asian British: Chinese',
						slug: 'asian-asian-british-chinese'
					},
					{
						code: 'QS201EW0014',
						name: 'Asian/Asian British: Other Asian',
						slug: 'asian-asian-british-other-asian'
					},
					{
						code: 'QS201EW0015',
						name: 'Black/African/Caribbean/Black British: African',
						slug: 'black-african-caribbean-black-british-african'
					},
					{
						code: 'QS201EW0016',
						name: 'Black/African/Caribbean/Black British: Caribbean',
						slug: 'black-african-caribbean-black-british-caribbean'
					},
					{
						code: 'QS201EW0017',
						name: 'Black/African/Caribbean/Black British: Other Black',
						slug: 'black-african-caribbean-black-british-other-black'
					},
					{
						code: 'QS201EW0018',
						name: 'Other ethnic group: Arab',
						slug: 'other-ethnic-group-arab'
					},
					{
						code: 'QS201EW0019',
						name: 'Other ethnic group: Any other ethnic group',
						slug: 'other-ethnic-group-any-other-ethnic-group'
					}
				],
				code: 'QS201EW',
				name: 'Ethnicity',
				slug: 'ethnicity',
				desc: 'How people identify the ethnic group they belong to.',
				total: {
					code: 'QS201EW0001',
					name: 'All categories: Ethnic group',
					slug: 'all-categories-ethnic-group'
				},
				units: 'People'
			},
			{
				categories: [
					{ code: 'KS202EW0002', name: 'English', slug: 'english' },
					{ code: 'KS202EW0003', name: 'English and British', slug: 'english-and-british' },
					{ code: 'KS202EW0007', name: 'Welsh', slug: 'welsh' },
					{ code: 'KS202EW0008', name: 'Welsh and British', slug: 'welsh-and-british' },
					{ code: 'KS202EW0022', name: 'British', slug: 'british' },
					{ code: 'KS202EW0039', name: 'Other identity', slug: 'other-identity' },
					{
						code: 'KS202EW0040',
						name: 'Other identity and any other UK identity',
						slug: 'other-identity-and-any-other-uk-identity'
					},
					{
						code: 'KS202EW0041',
						name: 'Any other combination of UK identity',
						slug: 'any-other-combination-of-uk-identity'
					}
				],
				code: 'KS202EW',
				name: 'National identity',
				slug: 'national-identity',
				desc: 'The countries people think of as home.',
				total: {
					code: 'KS202EW0001',
					name: 'All categories: National identity English',
					slug: 'all-categories-national-identity-english'
				},
				units: 'People'
			},
			{
				categories: [
					{ code: 'QS208EW0002', name: 'Christian', slug: 'christian' },
					{ code: 'QS208EW0003', name: 'Buddhist', slug: 'buddhist' },
					{ code: 'QS208EW0004', name: 'Hindu', slug: 'hindu' },
					{ code: 'QS208EW0005', name: 'Jewish', slug: 'jewish' },
					{ code: 'QS208EW0006', name: 'Muslim', slug: 'muslim' },
					{ code: 'QS208EW0007', name: 'Sikh', slug: 'sikh' },
					{ code: 'QS208EW0008', name: 'Other religion', slug: 'other-religion' },
					{ code: 'QS208EW0009', name: 'No religion', slug: 'no-religion' },
					{ code: 'QS208EW0010', name: 'Not stated', slug: 'not-stated' }
				],
				code: 'QS208EW',
				name: 'Religion and beliefs',
				slug: 'religion-and-beliefs',
				desc: "People's religion and beliefs. ",
				total: {
					code: 'QS208EW0001',
					name: 'All categories: Religion',
					slug: 'all-categories-religion'
				},
				units: 'People'
			},
			{
				categories: [
					{ code: 'QS203EW0003', name: 'Europe, United Kingdom', slug: 'europe-united-kingdom' },
					{ code: 'QS203EW0014', name: 'Europe, Ireland', slug: 'europe-ireland' },
					{ code: 'QS203EW0015', name: 'Europe, Other Europe', slug: 'europe-other-europe' },
					{ code: 'QS203EW0032', name: 'Africa', slug: 'africa' },
					{ code: 'QS203EW0045', name: 'Middle East and Asia', slug: 'middle-east-and-asia' },
					{
						code: 'QS203EW0063',
						name: 'The Americas and the Caribbean',
						slug: 'the-americas-and-the-caribbean'
					},
					{
						code: 'QS203EW0072',
						name: 'Antarctica, Oceania, and other',
						slug: 'antarctica-oceania-and-other'
					}
				],
				code: 'QS203EW',
				name: 'Country of birth',
				slug: 'country-of-birth',
				desc: 'People born in or outside the UK.',
				total: {
					code: 'QS203EW0001',
					name: 'All categories: Country of birth',
					slug: 'all-categories-country-of-birth'
				},
				units: 'People'
			},
			{
				categories: [
					{ code: 'QS803EW0002', name: 'Born in the UK', slug: 'born-in-the-uk' },
					{ code: 'QS803EW0003', name: 'Less than 2 years', slug: 'less-than-2-years' },
					{ code: 'QS803EW0004', name: '2 to 4 years', slug: '2-to-4-years' },
					{ code: 'QS803EW0005', name: '5 to 9 years', slug: '5-to-9-years' },
					{ code: 'QS803EW0006', name: '10 years or more', slug: '10-years-or-more' }
				],
				code: 'QS803EW',
				name: 'Length of time people have lived in the UK',
				slug: 'length-of-time-people-have-lived-in-the-uk',
				desc: 'People born or have moved to the UK.',
				total: {
					code: 'QS803EW0001',
					name: 'All categories: Length of residence in the UK',
					slug: 'all-categories-length-of-residence-in-the-uk'
				},
				units: 'People'
			},
			{
				categories: [
					{
						code: 'QS202EW0003',
						name: 'All household members have the same ethnic group',
						slug: 'all-household-members-have-the-same-ethnic-group'
					},
					{
						code: 'QS202EW0004',
						name: 'Different ethnic groups between the generations only',
						slug: 'different-ethnic-groups-between-the-generations-only'
					},
					{
						code: 'QS202EW0005',
						name: 'Different ethnic groups within partnerships',
						slug: 'different-ethnic-groups-within-partnerships'
					},
					{
						code: 'QS202EW0006',
						name: 'Any other combination of multiple ethnic groups',
						slug: 'any-other-combination-of-multiple-ethnic-groups'
					}
				],
				code: 'QS202EW',
				name: 'Ethnic groups living together',
				slug: 'ethnic-groups-living-together',
				desc: 'The mix of ethnic groups in a single household.',
				total: {
					code: 'QS202EW0001',
					name: 'All categories: Multiple ethnic groups',
					slug: 'all-categories-multiple-ethnic-groups'
				},
				units: 'Households'
			}
		]
	},
	{
		code: 'Population',
		name: 'Population',
		slug: 'population',
		desc: 'Residents and their living arrangements.',
		variables: [
			{
				categories: [
					{ code: 'QS104EW0002', name: 'Male', slug: 'male' },
					{ code: 'QS104EW0003', name: 'Female', slug: 'female' }
				],
				code: 'QS104EW',
				name: 'Sex',
				slug: 'sex',
				desc: 'The biological sex recorded by the person completing the census.',
				total: { code: 'QS104EW0001', name: 'All categories: Sex', slug: 'all-categories-sex' },
				units: 'People',
				joiner: 'who are'
			},
			{
				categories: [
					{ code: 'KS102EW0002', name: 'Age 0 to 4', slug: 'age-0-to-4' },
					{ code: 'KS102EW0003', name: 'Age 5 to 7', slug: 'age-5-to-7' },
					{ code: 'KS102EW0004', name: 'Age 8 to 9', slug: 'age-8-to-9' },
					{ code: 'KS102EW0005', name: 'Age 10 to 14', slug: 'age-10-to-14' },
					{ code: 'KS102EW0006', name: 'Age 15', slug: 'age-15' },
					{ code: 'KS102EW0007', name: 'Age 16 to 17', slug: 'age-16-to-17' },
					{ code: 'KS102EW0008', name: 'Age 18 to 19', slug: 'age-18-to-19' },
					{ code: 'KS102EW0009', name: 'Age 20 to 24', slug: 'age-20-to-24' },
					{ code: 'KS102EW0010', name: 'Age 25 to 29', slug: 'age-25-to-29' },
					{ code: 'KS102EW0011', name: 'Age 30 to 44', slug: 'age-30-to-44' },
					{ code: 'KS102EW0012', name: 'Age 45 to 59', slug: 'age-45-to-59' },
					{ code: 'KS102EW0013', name: 'Age 60 to 64', slug: 'age-60-to-64' },
					{ code: 'KS102EW0014', name: 'Age 65 to 74', slug: 'age-65-to-74' },
					{ code: 'KS102EW0015', name: 'Age 75 to 84', slug: 'age-75-to-84' },
					{ code: 'KS102EW0016', name: 'Age 85 to 89', slug: 'age-85-to-89' },
					{ code: 'KS102EW0017', name: 'Age 90 and over', slug: 'age-90-and-over' }
				],
				code: 'KS102EW',
				name: 'Age',
				slug: 'age',
				desc: 'The age of a person on Census Day, 21 March 2021.',
				total: { code: 'KS102EW0001', name: 'All categories: Age', slug: 'all-categories-age' },
				units: 'People'
			},
			{
				categories: [
					{
						code: 'KS103EW0002',
						name: 'Single',
						slug: 'single'
					},
					{
						code: 'KS103EW0003',
						name: 'Married',
						slug: 'married'
					},
					{
						code: 'KS103EW0005',
						name: 'Separated',
						slug: 'separated'
					},
					{
						code: 'KS103EW0006',
						name: 'Divorced',
						slug: 'divorced'
					},
					{
						code: 'KS103EW0007',
						name: 'Widowed',
						slug: 'widowed'
					}
				],
				code: 'KS103EW',
				name: 'Marital status',
				slug: 'marital-status',
				desc: 'People married of in civil partnerships.',
				total: {
					code: 'KS103EW0001',
					name: 'All categories: Marital and civil partnership status',
					slug: 'all-categories-marital-and-civil-partnership-status'
				},
				units: 'People'
			},
			{
				categories: [
					{
						code: 'QS119EW0002',
						name: 'Not deprived in any dimension',
						slug: 'not-deprived-in-any-dimension'
					},
					{ code: 'QS119EW0003', name: 'Deprived in 1 dimension', slug: 'deprived-in-1-dimension' },
					{
						code: 'QS119EW0004',
						name: 'Deprived in 2 dimensions',
						slug: 'deprived-in-2-dimensions'
					},
					{
						code: 'QS119EW0005',
						name: 'Deprived in 3 dimensions',
						slug: 'deprived-in-3-dimensions'
					},
					{
						code: 'QS119EW0006',
						name: 'Deprived in 4 dimensions',
						slug: 'deprived-in-4-dimensions'
					}
				],
				code: 'QS119EW',
				name: 'Household deprivation',
				slug: 'household-deprivation',
				desc: 'How deprived the households are in this area.',
				total: {
					code: 'QS119EW0001',
					name: 'All categories: Classification of household deprivation',
					slug: 'all-categories-classification-of-household-deprivation'
				},
				units: 'Households'
			},
			{
				categories: [
					{ code: 'QS101EW0002', name: 'Lives in a household', slug: 'lives-in-a-household' },
					{
						code: 'QS101EW0003',
						name: 'Lives in a communal establishment',
						slug: 'lives-in-a-communal-establishment'
					}
				],
				code: 'QS101EW',
				name: 'Residence type',
				slug: 'residence-type',
				desc: 'Families and other groups living in the same home or communal establishment.',
				total: {
					code: 'QS101EW0001',
					name: 'All categories: Residence type',
					slug: 'all-categories-residence-type'
				},
				units: 'People'
			},
			{
				categories: [
					{ code: 'QS113EW0002', name: 'One person household', slug: 'one-person-household' },
					{ code: 'QS113EW0005', name: 'One family households', slug: 'one-family-households' },
					{
						code: 'QS113EW0026',
						name: 'Multiple family households',
						slug: 'multiple-family-households'
					}
				],
				code: 'QS113EW',
				name: 'Families living in the same home',
				slug: 'families-living-in-the-same-home',
				desc: 'Types of families living in the same home.',
				total: {
					code: 'QS113EW0001',
					name: 'All categories: Household composition',
					slug: 'all-categories-household-composition'
				},
				units: 'Households'
			}
		]
	},
	{
		code: 'Work',
		name: 'Work',
		slug: 'work',
		desc: 'Residents employment status.',
		variables: [
			{
				categories: [
					{ code: 'QS601EW0002', name: 'Economically active', slug: 'economically-active' },
					{ code: 'QS601EW0011', name: 'Economically inactive', slug: 'economically-inactive' }
				],
				code: 'QS601EW',
				name: 'Economic activity',
				slug: 'economic-activity',
				desc: 'People who are in work, starting work, looking for or do not work.',
				total: {
					code: 'QS601EW0001',
					name: 'All categories: Economic activity',
					slug: 'all-categories-economic-activity'
				},
				units: 'People'
			},
			{
				categories: [
					{
						code: 'QS604EW0002',
						name: 'Part-time (less than 30 hours per week)',
						slug: 'part-time-less-than-30-hours-per-week'
					},
					{
						code: 'QS604EW0005',
						name: 'Full-time (more than 30 hours per week)',
						slug: 'full-time-more-than-30-hours-per-week'
					}
				],
				code: 'QS604EW',
				name: 'Working hours',
				slug: 'working-hours',
				desc: 'Hours people work per week.',
				total: {
					code: 'QS604EW0001',
					name: 'All categories: Hours worked',
					slug: 'all-categories-hours-worked'
				},
				units: 'People who have a job or their last job'
			},
			{
				categories: [
					{
						code: 'QS605EW0002',
						name: 'Agriculture, energy and water',
						slug: 'agriculture-energy-and-water'
					},
					{ code: 'QS605EW0004', name: 'Manufacturing', slug: 'manufacturing' },
					{ code: 'QS605EW0014', name: 'Construction', slug: 'construction' },
					{
						code: 'QS605EW0016',
						name: 'Transportation and communications',
						slug: 'transportation-and-communications'
					},
					{
						code: 'QS605EW0017',
						name: 'Distribution, hotels and restaurants',
						slug: 'distribution-hotels-and-restaurants'
					},
					{
						code: 'QS605EW0019',
						name: 'Financial, real estate, professional and administrative services',
						slug: 'financial-real-estate-professional-and-administrative-services'
					}
				],
				code: 'QS605EW',
				name: 'Sector',
				slug: 'sector',
				desc: 'Types of sectors people who have a job or their last job worked in.',
				total: {
					code: 'QS605EW0001',
					name: 'All categories: Industry',
					slug: 'all-categories-industry'
				},
				units: 'People'
			},
			{
				categories: [
					{
						code: 'QS606EW0002',
						name: 'Managers, directors and senior officials',
						slug: 'managers-directors-and-senior-officials'
					},
					{
						code: 'QS606EW0017',
						name: 'Professional occupations',
						slug: 'professional-occupations'
					},
					{
						code: 'QS606EW0038',
						name: 'Associate professional and technical occupations',
						slug: 'associate-professional-and-technical-occupations'
					},
					{
						code: 'QS606EW0059',
						name: 'Administrative and secretarial occupations',
						slug: 'administrative-and-secretarial-occupations'
					},
					{
						code: 'QS606EW0104',
						name: 'Process, plant and machine operatives',
						slug: 'process-plant-and-machine-operatives'
					},
					{
						code: 'QS606EW0114',
						name: 'Unskilled or semi-skilled occupations',
						slug: 'unskilled-or-semi-skilled-occupations'
					}
				],
				code: 'QS606EW',
				name: 'Job',
				slug: 'job',
				desc: 'The types of jobs people do',
				total: {
					code: 'QS606EW0001',
					name: 'All categories: Occupation',
					slug: 'all-categories-occupation'
				},
				units: 'People'
			},
			{
				categories: [
					{ code: 'QS701EW0002', name: 'Work mainly from home', slug: 'work-mainly-from-home' },
					{
						code: 'QS701EW0003',
						name: 'Underground, metro, light rail, tram',
						slug: 'underground-metro-light-rail-tram'
					},
					{ code: 'QS701EW0004', name: 'Train', slug: 'train' },
					{ code: 'QS701EW0005', name: 'Bus, minibus or coach', slug: 'bus-minibus-or-coach' },
					{
						code: 'QS701EW0007',
						name: 'Motorcycle, scooter or moped',
						slug: 'motorcycle-scooter-or-moped'
					},
					{ code: 'QS701EW0010', name: 'Bicycle', slug: 'bicycle' },
					{ code: 'QS701EW0011', name: 'Walking', slug: 'walking' },
					{ code: 'QS701EW0012', name: 'Other', slug: 'other' },
					{ code: 'QS701EW0006', name: 'Taxi', slug: 'taxi' },
					{ code: 'QS701EW0008', name: 'Driving in a car or van', slug: 'driving-in-a-car-or-van' },
					{
						code: 'QS701EW0009',
						name: 'Passenger in a car or van',
						slug: 'passenger-in-a-car-or-van'
					},
					{ code: 'QS701EW0013', name: 'Not in employment', slug: 'not-in-employment' }
				],
				code: 'QS701EW',
				name: 'Travel to work',
				slug: 'travel-to-work',
				desc: 'Types of transport people use to travel to work.',
				total: {
					code: 'QS701EW0001',
					name: 'All categories: Method of travel to work',
					slug: 'all-categories-method-of-travel-to-work'
				},
				units: 'People'
			}
		]
	}
];
