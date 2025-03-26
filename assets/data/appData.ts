export const appData = {
    intro: [
        {
            id: 1,
            img: require('@/assets/images/landing/3d-hand-hold-mobile-phone-with-blank-screen.jpg'),
            title: 'Ring Size Finder',
            description: 'Try out this Ring Size Finder with a coin without the need of going out to jewelry shops.',
        },
        {
            id: 2,
            img: require('@/assets/images/landing/10334485.png'),
            title: 'Virtual Try-On',
            description: 'Have no worries about the suitability of rings and bangles with our Virtual Try-On feature.',
        },
        {
            id: 3,
            img: require('@/assets/images/landing/landingpage3.png'),
            title: 'Exclusive Collections',
            description: 'Explore our curated collection of rings and bangles crafted for every occasion, from casual wear to elegant events.',
        },
        {
            id: 4,
            img: require('@/assets/images/landing/landingpage4.png'),
            title: 'Timeless Elegance',
            description: 'Discover rings and bangles with timeless designs that never go out of style, perfect for elevating any outfit.',
        },
        {
            id: 5,
            img: require('@/assets/images/landing/landingpage5.png'),
            title: 'Secure and Easy Shopping',
            description: 'Enjoy a seamless and secure shopping experience with easy payment options and fast delivery.',
        },
    ],
    landingItems: [
        {
            id: 0,
            img: require('@/assets/images/bangles/bangle1.png'),
            title: 'Calvin Bangles',
            price:'15,000.00 PHP'
        },
        {
            id: 1,
            img: require('@/assets/images/rings/TiffanyKhalafRing.png'),
            title: 'Tiffany Ring',
            price:'15,000.00 PHP'
        },
        {
            id: 2,
            img: require('@/assets/images/rings/WinstonKhalafRing.png'),
            title: 'Winston Khalaf Ring',
            price:'13,000.00 PHP'
        },
        {
            id: 3,
            img: require('@/assets/images/bangles/arBangle.png'),
            title: 'Bangle',
            price:'5,000.00 PHP'
        },
    ],
    profile: {
        dp: require('@/assets/images/avatars/7309707.jpg')
    },
    categories: [
        {
            id:0,
            name: 'All',
            iconProvider: 'MaterialCommunityIcons',
            iconName: 'select-all'
        },
        {
            id:1,
            name: 'rings',
            iconProvider: 'MaterialCommunityIcons',
            iconName: 'ring',
            rings: [
                {
                    id: 12412,
                    img: [
                        require('@/assets/images/rings/TiffanyKhalafRing.png'),
                        require('@/assets/images/rings/TiffanyKhalafRing2.png'),
                        require('@/assets/images/rings/TiffanyKhalafRing3.png'),
                    ],
                    name: 'Tiffany Khalaf',
                    sizes: [6, 8, 8.5, 9.5, 10.5],
                    description: 'Oval diamond centre and floral diamond halo engagement ring set in 18ct yellow gold. Oval diamond centre and floral diamond halo engagement ring set in 18ct yellow gold. Oval diamond centre and floral diamond halo engagement ring set in 18ct yellow gold.',
                    rating: 5,
                    sold: 44,
                    price: '15,000.00',
                    stock:100,
                    AR: false,
                },
                {
                    id: 92460,
                    img: [
                        require('@/assets/images/rings/WinstonKhalafRing.png'),
                    ],
                    name: 'Winston Khalaf',
                    sizes: [5,7.5, 8, 8.5, 9.5, 10.5],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 3.3,
                    sold: 20,
                    price: '13,000.00',
                    stock:120,
                    AR: false,
                },
                {
                    id: 51234,
                    img: [
                        require('@/assets/images/rings/WinstonKhalafRing.png'),
                    ],
                    name: 'Gottfried Khalaf',
                    sizes: [5, 7, 9, 10],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 5,
                    sold: 14,
                    price: '20,000.00',
                    stock:30,
                    AR: false,
                },
                {
                    id: 14634,
                    img: [
                        require('@/assets/images/rings/ArpelsKhalafRing.png'),
                    ],
                    name: 'Mejur Khalaf',
                    sizes: [7.5, 8, 8.5, 9.5, 10.5],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 4,
                    sold: 24,
                    price: '20,000.00',
                    stock:90,
                    AR: false,
                },
                {
                    id: 11111,
                    img: [
                        require('@/assets/images/rings/ring_main1.png'),
                    ],
                    name: 'Ring',
                    sizes: [6.5, 8, 8.5, 9.5, 10, 10.5],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 4.1,
                    sold: 24,
                    price: '20,000.00',
                    stock:90,
                    AR: false,
                },

                {
                    id: 11112,
                    img: [
                        require('@/assets/images/rings/ring_main2.png'),
                    ],
                    name: 'TestRing',
                    sizes: [7.5, 8, 8.5, 9.5, 10.5],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 3.7,
                    sold: 24,
                    price: '20,000.00',
                    stock:90,
                    AR: false,
                },
                {
                    id: 10986,
                    img: [
                        require('@/assets/images/rings/arRing.jpg'),
                        require('@/assets/images/rings/arRing2.jpg'),
                    ],
                    name: 'Ring',
                    sizes: [7.5, 8, 8.5, 9.5, 10.5],
                    description: 'Oval diamond centre and floral diamond halo engagement ring set in 18ct yellow gold.',
                    rating: 3.7,
                    sold: 24,
                    price: '20,000.00',
                    stock:90,
                    AR: true,
                    arlink: 'https://a1khalafgoldandjewelrytryon.web.app/ring1'
                },

            ],
            
        },
        {
            id:2,
            name: 'bangles',
            iconProvider: 'FontAwesome5',
            iconName: 'ring',
            bangles: [
                {
                    id: 12423,
                    img: [
                        require('@/assets/images/bangles/bangle1.png'),
                    ],
                    name: 'Calvin Bangles',
                    sizes: [12,14,16,18,20],
                    description: 'Elegant gold bangle with intricate design.',
                    rating: 4.2,
                    sold: 10,
                    price: '5,000.00',
                    stock: 50,
                    AR: false,
                },
                {
                    id: 12323,
                    img: [
                        require('@/assets/images/bangles/bangle2.png'),
                    ],
                    name: 'Lester Bangle',
                    sizes: [12,14,16,18,20],
                    description: 'Stylish silver bangle with modern design.',
                    rating: 4.5,
                    sold: 30,
                    price: '3,000.00',
                    stock: 70,
                    AR: false,
                },
                {
                    id: 12523,
                    img: [
                        require('@/assets/images/bangles/bangle_main1.png'),
                    ],
                    name: 'Bangle',
                    sizes: [17, 19],
                    description: 'Elegant gold bangle with intricate design.',
                    rating: 3.9,
                    sold: 10,
                    price: '5,000.00',
                    stock: 50,
                    AR: false,
                },

                {
                    id: 12623,
                    img: [
                        require('@/assets/images/bangles/bangle_main2.png'),
                    ],
                    name: 'Bangle',
                    sizes: [15, 17, 18, 19],
                    description: 'Elegant gold bangle with intricate design.',
                    rating: 4.5,
                    sold: 10,
                    price: '5,000.00',
                    stock: 50,
                    AR: false,
                },
                {
                    id: 12624,
                    img: [
                        require('@/assets/images/bangles/arBangle.png'),
                    ],
                    name: 'Bangle',
                    sizes: [15, 17, 18, 19],
                    description: 'Elegant gold bangle with intricate design.',
                    rating: 4.5,
                    sold: 10,
                    price: '5,000.00',
                    stock: 50,
                    AR: true,
                    arlink:'https://a1khalafgoldandjewelrytryon.web.app/bracelet1'
                },
            ], 
        },
    ],
    cameraHelp: [
        {
            id: 1,
            img: require('@/assets/images/coins/compiled.png'),
            title: 'New Generation Currency Coin series',
            description: 'Use only coins that are made compatible as reference width to determine your size',
        },
        {
            id: 2,
            img: require('@/assets/images/demo/fingerMeasurementDemo.jpeg'),
            title: 'Finger Measurement Demo',
            description: 'Place the coin above your hand and spread your fingers just like the image from above',
        },
        {
            id: 3,
            img: require('@/assets/images/demo/wristMeasurementDemo.jpeg'),
            title: 'Wrist Measurement Demo',
            description: 'Place the coin above your hand and close your fist just like the image from above',
        },
        {
            id: 4,
            img: require('@/assets/images/demo/crosshair.png'),
           title: 'Camera Demo',
           description: 'In order for you to take a photo, the crosshair must be centered, Once its yellow that means it is centered and ready to take a pic.'  
        },
    ],
};