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
            img: require('@/assets/images/landing/10334485.png'),
            title: 'Niga',
            price:'15000 PHP'
        },
        {
            id: 1,
            img: require('@/assets/images/landing/10334490.png'),
            title: 'Tiffany Ring',
            price:'15000 PHP'
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
                    sizes: [12,14,16,18,20],
                    description: 'Oval diamond centre and floral diamond halo engagement ring set in 18ct yellow gold. Oval diamond centre and floral diamond halo engagement ring set in 18ct yellow gold. Oval diamond centre and floral diamond halo engagement ring set in 18ct yellow gold.',
                    rating: 5,
                    sold: 44,
                    price: '15000',
                    stock:100,
                    AR: false,
                },
                {
                    id: 92460,
                    img: [
                        require('@/assets/images/rings/WinstonKhalafRing.png'),
                    ],
                    name: 'Winston Khalaf',
                    sizes: [12,14,16,18,20,22],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 3.3,
                    sold: 20,
                    price: '13000',
                    stock:120,
                    AR: false,
                },
                {
                    id: 51234,
                    img: [
                        require('@/assets/images/rings/WinstonKhalafRing.png'),
                    ],
                    name: 'Mejur Khalaf',
                    sizes: [12,16,18,20],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 5,
                    sold: 14,
                    price: '20000',
                    stock:30,
                    AR: false,
                },
                {
                    id: 14634,
                    img: [
                        require('@/assets/images/rings/ArpelsKhalafRing.png'),
                    ],
                    name: 'Mejur Khalaf',
                    sizes: [12,14,16],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 4,
                    sold: 24,
                    price: '20000',
                    stock:90,
                    AR: false,
                },
                {
                    id: 11111,
                    img: [
                        require('@/assets/images/rings/ring_main1.png'),
                    ],
                    name: 'Ring',
                    sizes: [6.5, 8, 8.5, 9.5, 10, 10.5, 11.5, 12.5],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 4.1,
                    sold: 24,
                    price: '20000',
                    stock:90,
                    AR: true,
                },

                {
                    id: 11112,
                    img: [
                        require('@/assets/images/rings/ring_main2.png'),
                    ],
                    name: 'Ring',
                    sizes: [7.5, 8, 8.5, 9.5, 10.5],
                    description: '123asfaesgaiorpzshgoiserignes',
                    rating: 3.7,
                    sold: 24,
                    price: '20000',
                    stock:90,
                    AR: true,
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
                    price: '20000',
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
                    name: 'Seanono Lover',
                    sizes: [12,14,16,18,20],
                    description: 'Elegant gold bangle with intricate design.',
                    rating: 4.2,
                    sold: 10,
                    price: '5000',
                    stock: 50,
                    AR: false,
                },
                {
                    id: 12323,
                    img: [
                        require('@/assets/images/bangles/bangle2.png'),
                    ],
                    name: 'Jaigga',
                    sizes: [12,14,16,18,20],
                    description: 'Stylish silver bangle with modern design.',
                    rating: 4.5,
                    sold: 30,
                    price: '3000',
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
                    price: '5000',
                    stock: 50,
                    AR: true,
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
                    price: '5000',
                    stock: 50,
                    AR: true,
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
                    price: '5000',
                    stock: 50,
                    AR: true,
                    arlink:'https://a1khalafgoldandjewelrytryon.web.app/bracelet1'
                },
            ], 
        },
    ]
};