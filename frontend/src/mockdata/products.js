const products = [
    {
        id: 1,
        type: 'vinyl',
        genre: 'pop',
        title: 'Midnights (The Til Dawn Edition)',
        artist: 'Taylor Swift',
        price: 129.90,
        image: 'https://i.scdn.co/image/ab67616d0000b273fa747621a53c8e2cc436dee0',
        description: 'Midnights is the tenth studio album by the American singer-songwriter Taylor Swift. It was released on October 21, 2022, by Republic Records. She conceived Midnights as a concept album about nocturnal ruminations inspired by her sleepless nights. The confessional lyrics explore regret, self-criticism, fantasies, heartbreak, and infatuation, with allusions to her personal life and public image.',
        images: [
            'https://i.scdn.co/image/ab67616d0000b273fa747621a53c8e2cc436dee0',
            'https://i.scdn.co/image/ab67616d0000b273fa747621a53c8e2cc436dee0',
            'https://i.scdn.co/image/ab67616d0000b273fa747621a53c8e2cc436dee0',
        ],
    },
    {
        id: 2,
        type: 'vinyl',
        genre: 'r&b',
        title: 'Renaissance',
        artist: 'Beyoncé',
        price: 119.90,
        image: 'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9d/Renaissance_-_Beyonc%C3%A9.png/250px-Renaissance_-_Beyonc%C3%A9.png',
        description: 'Renaissance (also referred to as Act I: Renaissance) is the seventh studio album by American singer and songwriter Beyoncé. It was released on July 29, 2022, by Parkwood Entertainment and Columbia Records. Her first solo studio release since Lemonade (2016) and the first installment of her trilogy project, Beyoncé wrote and produced the album with Nova Wav, The-Dream, Symbolyc One, A. G. Cook, Honey Dijon, Beam, Tricky Stewart, BloodPop, Skrillex, Hit-Boy, No I.D., P2J and various other collaborators. Beam, Grace Jones and Tems appear as guest vocalists.',
        images: [
            'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9d/Renaissance_-_Beyonc%C3%A9.png/250px-Renaissance_-_Beyonc%C3%A9.png',
            'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9d/Renaissance_-_Beyonc%C3%A9.png/250px-Renaissance_-_Beyonc%C3%A9.png',
            'https://upload.wikimedia.org/wikipedia/pt/thumb/9/9d/Renaissance_-_Beyonc%C3%A9.png/250px-Renaissance_-_Beyonc%C3%A9.png',
        ]
    },
    {
        id: 3,
        type: 'cd',
        genre: 'pop',
        title: 'GUTS',
        artist: 'Olivia Rodrigo',
        price: 49.90,
        image: 'https://cdn-images.dzcdn.net/images/cover/4bb79214365c0049e031f5e2caae4752/0x1900-000000-80-0-0.jpg',
        description: 'Guts is the second studio album by American singer-songwriter Olivia Rodrigo, released on September 8, 2023, through Geffen Records. It was written and recorded with Rodrigo working closely alongside Dan Nigro, the producer and multi-instrumentalist of her debut album Sour (2021). Inspired by the period of time immediately following Sour\'s success, Rodrigo conceived Guts hoping to reflect the process of maturity she experienced toward the end of her teenage years.',
        images: [
            'https://cdn-images.dzcdn.net/images/cover/4bb79214365c0049e031f5e2caae4752/0x1900-000000-80-0-0.jpg',
            'https://cdn-images.dzcdn.net/images/cover/4bb79214365c0049e031f5e2caae4752/0x1900-000000-80-0-0.jpg',
            'https://cdn-images.dzcdn.net/images/cover/4bb79214365c0049e031f5e2caae4752/0x1900-000000-80-0-0.jpg',
        ]
    },
    {
        id: 4,
        type: 'vinyl',
        genre: 'r&b',
        title: 'SOS',
        artist: 'SZA',
        price: 109.90,
        image: 'https://upload.wikimedia.org/wikipedia/pt/c/c8/SZA_-_SOS.png',
        description: 'SOS is the second studio album by American singer-songwriter SZA. It was released on December 9, 2022, by Top Dawg Entertainment (TDE) and RCA Records. The album features guest appearances from Don Toliver, Phoebe Bridgers, Travis Scott, and the late Ol\' Dirty Bastard. SZA worked with a variety of record producers and songwriters such as Babyface, Jeff Bhasker, Rob Bisel, Benny Blanco, Darkchild, DJ Dahi, Ant Clemons, and Lizzo. It serves as the follow-up to SZA\'s debut album Ctrl (2017).',
        images: [
            'https://upload.wikimedia.org/wikipedia/pt/c/c8/SZA_-_SOS.png',
            'https://upload.wikimedia.org/wikipedia/pt/c/c8/SZA_-_SOS.png',
            'https://upload.wikimedia.org/wikipedia/pt/c/c8/SZA_-_SOS.png',
        ]
    },
    {
        id: 5,
        type: 'vinyl',
        genre: 'pop',
        title: 'Hurry Up Tomorrow',
        artist: 'The Weeknd',
        price: 99.90,
        image: 'https://akamai.sscdn.co/uploadfile/letras/albuns/7/5/9/b/2621201738316056.jpg',
        description: 'Hurry Up Tomorrow is the sixth studio album by Canadian singer-songwriter the Weeknd. It was released through XO and Republic Records on January 31, 2025. It also serves as a companion piece to the film of the same name. The standard album contains guest appearances from Anitta, Justice, Travis Scott, Florence and the Machine, Future, Playboi Carti, Giorgio Moroder, and Lana Del Rey, with a bonus edition containing an additional appearance from Swedish House Mafia.[1] Production was primarily handled by the Weeknd himself and his regular collaborators including Cirkut, DaHeala, Max Martin, Mike Dean, Metro Boomin, Prince85 and OPN, alongside various other producers.',
        images: [
            'https://akamai.sscdn.co/uploadfile/letras/albuns/7/5/9/b/2621201738316056.jpg',
            'https://akamai.sscdn.co/uploadfile/letras/albuns/7/5/9/b/2621201738316056.jpg',
            'https://akamai.sscdn.co/uploadfile/letras/albuns/7/5/9/b/2621201738316056.jpg',
        ]
    },
    {
        id: 6,
        type: 'cd',
        genre: 'hip hop', 
        title: 'UTOPIA',
        artist: 'Travis Scott',
        price: 59.90,
        image: 'https://cdn-images.dzcdn.net/images/cover/6c91e64b7157f1332a4f6b0de9e4c714/0x1900-000000-80-0-0.jpg',
        description: 'Utopia is the fourth studio album by American rapper Travis Scott. It was released through Cactus Jack and Epic Records on July 28, 2023. The album features guest appearances from Teezo Touchdown, Drake, Playboi Carti, Beyoncé, Rob49, 21 Savage, the Weeknd, Swae Lee, Yung Lean, Dave Chappelle, Young Thug, Westside Gunn, Kid Cudi, Bad Bunny, SZA, Future, and James Blake. Physical releases of the album feature additional guest appearances from Lil Uzi Vert and Sheck Wes.',
        images: [
            'https://cdn-images.dzcdn.net/images/cover/6c91e64b7157f1332a4f6b0de9e4c714/0x1900-000000-80-0-0.jpg',
            'https://cdn-images.dzcdn.net/images/cover/6c91e64b7157f1332a4f6b0de9e4c714/0x1900-000000-80-0-0.jpg',
            'https://cdn-images.dzcdn.net/images/cover/6c91e64b7157f1332a4f6b0de9e4c714/0x1900-000000-80-0-0.jpg',
        ]
    },
    {
        id: 7,
        type: 'vinyl',
        genre: 'pop',
        title: 'Endless Summer Vacation',
        artist: 'Miley Cyrus',
        price: 115.90,
        image: 'https://upload.wikimedia.org/wikipedia/pt/c/cd/Endless_Summer_Vacation.jpg',
        description: 'Endless Summer Vacation is the eighth studio album by American singer and songwriter Miley Cyrus. It was released on March 10, 2023, via Columbia Records. It is her first new body of work since leaving RCA Records after her seventh studio album, Plastic Hearts (2020), and signing with Columbia in early 2021. A pop and dance-pop record, Endless Summer Vacation is a shift from the synth-pop, rock, and glam rock genres that features on Plastic Hearts. Cyrus related its overall concept to her affection for Los Angeles, California, where the album was mainly recorded, and its track sequencing to the course of a day. Brandi Carlile and Sia are featured as guest vocalists.',
        images: [
            'https://upload.wikimedia.org/wikipedia/pt/c/cd/Endless_Summer_Vacation.jpg',
            'https://upload.wikimedia.org/wikipedia/pt/c/cd/Endless_Summer_Vacation.jpg',
            'https://upload.wikimedia.org/wikipedia/pt/c/cd/Endless_Summer_Vacation.jpg',
        ]
    },
    {
        id: 8,
        type: 'vinyl',
        genre: 'pop',
        title: 'DeBÍ TiRAR MáS FOToS',
        artist: 'Bad Bunny',
        price: 125.90,
        image: 'https://monkeybuzz.com.br/wp-content/uploads/2025/01/capa-bb.jpg',
        description: '"Debí Tirar Más Fotos" (Spanish for "I Should Have Taken More Photos"), stylized as DeBÍ TiRAR MáS FOToS and abbreviated as DtMF, is the sixth solo studio album (seventh overall) by Puerto Rican rapper and singer Bad Bunny. It was released on January 5, 2025, by Rimas Entertainment, following his previous album Nadie Sabe Lo Que Va a Pasar Mañana (2023). Musically, the album is primarily a reggaeton record that blends various elements of traditional Puerto Rican music from Bad Bunny’s childhood, including plena, jíbaro, and salsa, similar to his 2022 album Un Verano Sin Ti. The lyrics explore the complexities of Puerto Rico’s political status and related issues, such as gentrification and cultural identity loss. The album features collaborations with Chuwi, Omar Courtz, Los Pleneros de la Cresta, Dei V, and RaiNao.',
        images: [
            'https://monkeybuzz.com.br/wp-content/uploads/2025/01/capa-bb.jpg',
            'https://monkeybuzz.com.br/wp-content/uploads/2025/01/capa-bb.jpg',
            'https://monkeybuzz.com.br/wp-content/uploads/2025/01/capa-bb.jpg',
        ]
    },
    {
        id: 9,
        type: 'cd',
        genre: 'pop',
        title: 'Harry\'s House',
        artist: 'Harry Styles',
        price: 79.90,
        image: 'https://upload.wikimedia.org/wikipedia/pt/d/d5/Harry_Styles_-_Harry%27s_House.png',
        description: 'Harry\'s House is the third studio album by British singer-songwriter Harry Styles. Released in 2022, the album is a collection of pop-funk and synth-pop songs with touches of soul and R&B. It\'s an intimate and fun work that explores themes of love, home, and self-discovery, praised for its elegant production and catchy lyrics.',
        images: [
            'https://upload.wikimedia.org/wikipedia/pt/d/d5/Harry_Styles_-_Harry%27s_House.png',
            'https://upload.wikimedia.org/wikipedia/pt/d/d5/Harry_Styles_-_Harry%27s_House.png',
            'https://upload.wikimedia.org/wikipedia/pt/d/d5/Harry_Styles_-_Harry%27s_House.png',
        ]
    },
    {
        id: 10,
        type: 'vinyl',
        genre: 'classical',
        title: 'Beethoven: The 9 Symphonies',
        artist: 'Berliner Philharmoniker & Herbert von Karajan',
        price: 299.90,
        image: 'https://m.media-amazon.com/images/I/81k2atuVA5L._UF1000,1000_QL80_.jpg',
        description: 'Beethoven: The 9 Symphonies is a classic recording of Ludwig van Beethoven\'s nine symphonies by the Berlin Philharmonic, conducted by Herbert von Karajan. This set is considered one of the definitive interpretations of Beethoven\'s masterpieces, offering a rich and immersive sonic experience that is essential for classical music lovers and audiophiles.',
        images: [
            'https://m.media-amazon.com/images/I/81k2atuVA5L._UF1000,1000_QL80_.jpg',
            'https://m.media-amazon.com/images/I/81k2atuVA5L._UF1000,1000_QL80_.jpg',
            'https://m.media-amazon.com/images/I/81k2atuVA5L._UF1000,1000_QL80_.jpg',
        ]
    },
    {
        id: 11,
        type: 'cd',
        genre: 'pop',
        title: 'Planet Her',
        artist: 'Doja Cat',
        price: 69.90,
        image: 'https://m.media-amazon.com/images/I/81YJQEQPmJL._UF1000,1000_QL80_.jpg',
        description: 'Planet Her is the third studio album by American rapper and singer Doja Cat. Released in 2021, the album is a fusion of pop, R&B, hip hop, and touches of Afrobeats, with lyrics exploring themes of sexuality, femininity, and relationships. With hits like \'Kiss Me More\' and \'Woman,\' the album showcases Doja Cat\'s versatility and talent',
        images: [
            'https://m.media-amazon.com/images/I/81YJQEQPmJL._UF1000,1000_QL80_.jpg',
            'https://m.media-amazon.com/images/I/81YJQEQPmJL._UF1000,1000_QL80_.jpg',
            'https://m.media-amazon.com/images/I/81YJQEQPmJL._UF1000,1000_QL80_.jpg',

        ]
    },
    {
        id: 12,
        type: 'vinyl',
        genre: 'pop',
        title: 'Mayhem',
        artist: 'Lady Gaga',
        price: 139.90,
        image: 'https://upload.wikimedia.org/wikipedia/pt/0/0a/Lady_Gaga_-_Mayhem.jpg',
        description: 'Mayhem is the eighth studio album by American singer and songwriter Lady Gaga. It was released on March 7, 2025, through Streamline and Interscope Records. During the creation of the album, Gaga collaborated with producers such as Andrew Watt, Cirkut, and Gesaffelstein, resulting in an album that has a "chaotic blur of genres", mainly synth-pop, with industrial dance influences, and elements of electro, disco, funk, industrial pop, rock and pop rock. Thematically, it explores love, chaos, fame, identity, and desire, using metaphors of transformation, duality, and excess.',
        images: [
            'https://upload.wikimedia.org/wikipedia/pt/0/0a/Lady_Gaga_-_Mayhem.jpg',
            'https://upload.wikimedia.org/wikipedia/pt/0/0a/Lady_Gaga_-_Mayhem.jpg',
            'https://upload.wikimedia.org/wikipedia/pt/0/0a/Lady_Gaga_-_Mayhem.jpg',            
        ]
    },
    {
        id: 13,
        type: 'cd',
        genre: 'electronic',
        title: 'Random Access Memory',
        artist: 'Daft Punk',
        price: 109.90,
        image: 'https://monkeybuzz.com.br/wp-content/uploads/2013/05/daft-punk-random-access-memories-artwork.jpg',
        description: 'Random Access Memories is the fourth and final studio album by the French electronic music duo Daft Punk, released on 17 May 2013 through Columbia Records. It pays tribute to late 1970s and early 1980s American music, particularly from Los Angeles.',
        images: [
            'https://monkeybuzz.com.br/wp-content/uploads/2013/05/daft-punk-random-access-memories-artwork.jpg',
            'https://monkeybuzz.com.br/wp-content/uploads/2013/05/daft-punk-random-access-memories-artwork.jpg',
            'https://monkeybuzz.com.br/wp-content/uploads/2013/05/daft-punk-random-access-memories-artwork.jpg',      
        ]
    },
    {
        id: 14,
        type: 'vinyl',
        genre: 'rock',
        title: 'The Dark Side Of The Moon',
        artist: 'Pink Floyd',
        price: 179.90,
        image: 'https://m.media-amazon.com/images/I/51lsZBhvHRL._UF1000,1000_QL80_.jpg',
        description: 'The Dark Side of the Moon is the eighth studio album by the English rock band Pink Floyd, released on 1 March 1973, by Capitol Records in the US and on 16 March 1973, by Harvest Records in the UK. Developed during live performances before recording began, it was conceived as a concept album that would focus on the pressures faced by the band during their arduous lifestyle, and also deal with the mental health problems of the former band member Syd Barrett, who had departed the group in 1968',
        images: [
            'https://m.media-amazon.com/images/I/51lsZBhvHRL._UF1000,1000_QL80_.jpg',         
            'https://m.media-amazon.com/images/I/51lsZBhvHRL._UF1000,1000_QL80_.jpg',         
            'https://m.media-amazon.com/images/I/51lsZBhvHRL._UF1000,1000_QL80_.jpg',         
        ]
    },
    {
        id: 15,
        type: 'cd',
        genre: 'country',
        title: 'F-1 Trillion',
        artist: 'Post Malone',
        price: 10.90,
        image: 'https://m.media-amazon.com/images/I/41cYNGfZhJL._UF1000,1000_QL80_.jpg',
        description: 'F-1 Trillion is the sixth studio album by American musician Post Malone. It was released through Mercury and Republic Records on August 16, 2024. The album marks Malone\'s transition to country music and features guest appearances from Tim McGraw, Hank Williams Jr., Morgan Wallen, Blake Shelton, Dolly Parton, Brad Paisley, Luke Combs, Lainey Wilson, Jelly Roll, Ernest, Sierra Ferrell, Chris Stapleton, Hardy, and Billy Strings.',
        images: [
            'https://m.media-amazon.com/images/I/41cYNGfZhJL._UF1000,1000_QL80_.jpg',
            'https://m.media-amazon.com/images/I/41cYNGfZhJL._UF1000,1000_QL80_.jpg',
            'https://m.media-amazon.com/images/I/41cYNGfZhJL._UF1000,1000_QL80_.jpg',
        ]
    },
    {
        id: 16,
        type: 'vinyl',
        genre: 'indie',
        title: 'The 1975',
        artist: 'The 1975',
        price: 159.90,
        image: 'https://m.media-amazon.com/images/I/61GyEMY-bCL.jpg',
        description: 'The 1975 is the debut studio album by English band the 1975. It was released on 2 September 2013 through Dirty Hit and Polydor. It was produced by band members Matty Healy and George Daniel together with Mike Crossey.',
        images: [
            'https://m.media-amazon.com/images/I/61GyEMY-bCL.jpg',        
            'https://m.media-amazon.com/images/I/61GyEMY-bCL.jpg',        
            'https://m.media-amazon.com/images/I/61GyEMY-bCL.jpg',        
        ]
    },
    {
        id: 50,
        type: 'accessory',
        genre: 'CD Support',
        title: 'CD plastic organizer box',
        price: 19.90,
        image: 'https://img.kwcdn.com/product/fancy/9d2b422b-e024-4113-a808-20ed049b601b.jpg?imageView2/2/w/1300/q/90/format/webp',
        description: 'Made of plastic, 26x14x11cm',
        images: [
            'https://img.kwcdn.com/product/fancy/9d2b422b-e024-4113-a808-20ed049b601b.jpg?imageView2/2/w/1300/q/90/format/webp',
            'https://img.kwcdn.com/product/fancy/9d2b422b-e024-4113-a808-20ed049b601b.jpg?imageView2/2/w/1300/q/90/format/webp',
            'https://img.kwcdn.com/product/fancy/9d2b422b-e024-4113-a808-20ed049b601b.jpg?imageView2/2/w/1300/q/90/format/webp'        
        ]
    },
    {
        id: 51,
        type: 'accessory',
        genre: 'Vinyl Support',
        title: 'Vinyl wooden organizer box',
        price: 19.90,
        image: 'https://img.kwcdn.com/product/open/8cfb693ca79b4e9db66955c7d4f9ed40-goods.jpeg?imageView2/2/w/1300/q/90/format/webp',
        description: 'Made of metal, 15x18x18cm',
        images: [
            'https://img.kwcdn.com/product/open/8cfb693ca79b4e9db66955c7d4f9ed40-goods.jpeg?imageView2/2/w/1300/q/90/format/webp',   
            'https://img.kwcdn.com/product/open/8cfb693ca79b4e9db66955c7d4f9ed40-goods.jpeg?imageView2/2/w/1300/q/90/format/webp',   
            'https://img.kwcdn.com/product/open/8cfb693ca79b4e9db66955c7d4f9ed40-goods.jpeg?imageView2/2/w/1300/q/90/format/webp',   
        ]
    },
    {
        id: 52,
        type: 'accessory',
        genre: 'Vinyl Player',
        title: 'Industrial Vinyl Player',
        price: 200.00,
        image: 'https://img.kwcdn.com/product/open/52572828c89544d19879b64d8cbba023-goods.jpeg?imageView2/2/w/1300/q/90/format/webp',
        description: 'Made of metal and wood, 55x40x30cm',
        images: [
            'https://img.kwcdn.com/product/open/52572828c89544d19879b64d8cbba023-goods.jpeg?imageView2/2/w/1300/q/90/format/webp',
            'https://img.kwcdn.com/product/open/52572828c89544d19879b64d8cbba023-goods.jpeg?imageView2/2/w/1300/q/90/format/webp',
            'https://img.kwcdn.com/product/open/52572828c89544d19879b64d8cbba023-goods.jpeg?imageView2/2/w/1300/q/90/format/webp',
        ]
    },
    {
        id: 53,
        type: 'accessory',
        genre: 'CD Player',
        title: 'PC External CD Player',
        price: 19.90,
        image: 'https://img.kwcdn.com/product/fancy/69c4021a-5973-4e7c-9e07-c48b25130092.jpg?imageView2/2/w/1300/q/90/format/webp',
        description: 'USB charged, 15x14x2cm',
        images: [
            'https://img.kwcdn.com/product/fancy/69c4021a-5973-4e7c-9e07-c48b25130092.jpg?imageView2/2/w/1300/q/90/format/webp',
            'https://img.kwcdn.com/product/fancy/69c4021a-5973-4e7c-9e07-c48b25130092.jpg?imageView2/2/w/1300/q/90/format/webp',
            'https://img.kwcdn.com/product/fancy/69c4021a-5973-4e7c-9e07-c48b25130092.jpg?imageView2/2/w/1300/q/90/format/webp',
        ]
    },
];

module.exports = products;