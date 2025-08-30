// Menu data for all shops
export const menuData = {
  zuzu: {
    id: 'zuzu',
    name: 'ZUZU',
    description: 'Delicious street food & snacks',
    emoji: '🍕',
    color: 'zuzu',
    categories: ['Pizzas', 'Burgers', 'Sandwiches', 'Beverages'],
    items: [
      // Pizzas
      {
        id: 'z1',
        name: 'Margherita Pizza',
        description: 'Classic pizza with fresh mozzarella, tomatoes, and basil',
        price: 199,
        category: 'Pizzas',
        image: '🍕',
        isVeg: true,
        popular: true
      },
      {
        id: 'z2',
        name: 'Pepperoni Pizza',
        description: 'Spicy pepperoni with cheese and tomato sauce',
        price: 249,
        category: 'Pizzas',
        image: '🍕',
        isVeg: false,
        popular: true
      },
      {
        id: 'z3',
        name: 'Veggie Supreme',
        description: 'Bell peppers, onions, mushrooms, olives with cheese',
        price: 229,
        category: 'Pizzas',
        image: '🍕',
        isVeg: true,
        popular: false
      },
      // Burgers
      {
        id: 'z4',
        name: 'Classic Chicken Burger',
        description: 'Grilled chicken patty with lettuce, tomato, and mayo',
        price: 159,
        category: 'Burgers',
        image: '🍔',
        isVeg: false,
        popular: true
      },
      {
        id: 'z5',
        name: 'Veg Burger',
        description: 'Crispy veg patty with fresh vegetables and sauces',
        price: 129,
        category: 'Burgers',
        image: '🍔',
        isVeg: true,
        popular: false
      },
      // Sandwiches
      {
        id: 'z6',
        name: 'Grilled Sandwich',
        description: 'Toasted bread with cheese, vegetables, and spices',
        price: 89,
        category: 'Sandwiches',
        image: '🥪',
        isVeg: true,
        popular: true
      },
      {
        id: 'z7',
        name: 'Club Sandwich',
        description: 'Triple layer sandwich with chicken, bacon, and veggies',
        price: 179,
        category: 'Sandwiches',
        image: '🥪',
        isVeg: false,
        popular: false
      },
      // Beverages
      {
        id: 'z8',
        name: 'Cold Coffee',
        description: 'Refreshing iced coffee with cream and sugar',
        price: 69,
        category: 'Beverages',
        image: '☕',
        isVeg: true,
        popular: true
      },
      {
        id: 'z9',
        name: 'Fresh Lime Soda',
        description: 'Tangy lime juice with soda and mint',
        price: 49,
        category: 'Beverages',
        image: '🥤',
        isVeg: true,
        popular: false
      }
    ]
  },

  oasis: {
    id: 'oasis',
    name: 'Oasis Kitchen',
    description: 'Fresh & healthy meals',
    emoji: '🥗',
    color: 'oasis',
    categories: ['Salads', 'Bowls', 'Wraps', 'Smoothies'],
    items: [
      // Salads
      {
        id: 'o1',
        name: 'Caesar Salad',
        description: 'Crisp romaine lettuce with parmesan, croutons, and dressing',
        price: 189,
        category: 'Salads',
        image: '🥗',
        isVeg: true,
        popular: true
      },
      {
        id: 'o2',
        name: 'Greek Salad',
        description: 'Cucumber, tomatoes, olives, feta cheese with herbs',
        price: 199,
        category: 'Salads',
        image: '🥗',
        isVeg: true,
        popular: false
      },
      {
        id: 'o3',
        name: 'Chicken Salad',
        description: 'Grilled chicken with mixed greens and vinaigrette',
        price: 229,
        category: 'Salads',
        image: '🥗',
        isVeg: false,
        popular: true
      },
      // Bowls
      {
        id: 'o4',
        name: 'Buddha Bowl',
        description: 'Quinoa, roasted vegetables, chickpeas with tahini sauce',
        price: 249,
        category: 'Bowls',
        image: '🍲',
        isVeg: true,
        popular: true
      },
      {
        id: 'o5',
        name: 'Protein Bowl',
        description: 'Grilled chicken, brown rice, vegetables, and avocado',
        price: 279,
        category: 'Bowls',
        image: '🍲',
        isVeg: false,
        popular: false
      },
      // Wraps
      {
        id: 'o6',
        name: 'Veggie Wrap',
        description: 'Fresh vegetables, hummus, and herbs in whole wheat wrap',
        price: 149,
        category: 'Wraps',
        image: '🌯',
        isVeg: true,
        popular: true
      },
      {
        id: 'o7',
        name: 'Chicken Wrap',
        description: 'Grilled chicken, lettuce, tomatoes with mayo wrap',
        price: 179,
        category: 'Wraps',
        image: '🌯',
        isVeg: false,
        popular: false
      },
      // Smoothies
      {
        id: 'o8',
        name: 'Green Smoothie',
        description: 'Spinach, apple, banana, and coconut water blend',
        price: 119,
        category: 'Smoothies',
        image: '🥤',
        isVeg: true,
        popular: true
      },
      {
        id: 'o9',
        name: 'Berry Blast',
        description: 'Mixed berries, yogurt, and honey smoothie',
        price: 129,
        category: 'Smoothies',
        image: '🥤',
        isVeg: true,
        popular: false
      }
    ]
  },

  bites: {
    id: 'bites',
    name: 'Bites and Bites',
    description: 'Quick bites & beverages',
    emoji: '🍔',
    color: 'bites',
    categories: ['Snacks', 'Fast Food', 'Desserts', 'Drinks'],
    items: [
      // Snacks
      {
        id: 'b1',
        name: 'Samosa',
        description: 'Crispy fried pastry with spiced potato filling',
        price: 25,
        category: 'Snacks',
        image: '🥟',
        isVeg: true,
        popular: true
      },
      {
        id: 'b2',
        name: 'Pakora',
        description: 'Deep-fried vegetable fritters with chutneys',
        price: 35,
        category: 'Snacks',
        image: '🥘',
        isVeg: true,
        popular: true
      },
      {
        id: 'b3',
        name: 'Chicken Nuggets',
        description: 'Crispy fried chicken pieces with dipping sauce',
        price: 149,
        category: 'Snacks',
        image: '🍗',
        isVeg: false,
        popular: false
      },
      // Fast Food
      {
        id: 'b4',
        name: 'Vada Pav',
        description: 'Mumbai street food - spiced potato fritter in bread',
        price: 39,
        category: 'Fast Food',
        image: '🍔',
        isVeg: true,
        popular: true
      },
      {
        id: 'b5',
        name: 'Pav Bhaji',
        description: 'Spiced vegetable curry with buttered bread rolls',
        price: 89,
        category: 'Fast Food',
        image: '🍛',
        isVeg: true,
        popular: true
      },
      {
        id: 'b6',
        name: 'Chicken Roll',
        description: 'Spiced chicken wrapped in soft paratha bread',
        price: 119,
        category: 'Fast Food',
        image: '🌯',
        isVeg: false,
        popular: false
      },
      // Desserts
      {
        id: 'b7',
        name: 'Chocolate Brownie',
        description: 'Rich chocolate brownie with nuts and ice cream',
        price: 99,
        category: 'Desserts',
        image: '🍰',
        isVeg: true,
        popular: true
      },
      {
        id: 'b8',
        name: 'Gulab Jamun',
        description: 'Sweet milk dumplings in sugar syrup (2 pieces)',
        price: 59,
        category: 'Desserts',
        image: '🍮',
        isVeg: true,
        popular: false
      },
      // Drinks
      {
        id: 'b9',
        name: 'Masala Chai',
        description: 'Traditional Indian spiced tea with milk',
        price: 29,
        category: 'Drinks',
        image: '☕',
        isVeg: true,
        popular: true
      },
      {
        id: 'b10',
        name: 'Mango Lassi',
        description: 'Creamy yogurt drink with fresh mango',
        price: 79,
        category: 'Drinks',
        image: '🥤',
        isVeg: true,
        popular: false
      }
    ]
  },

  shakers: {
    id: 'shakers',
    name: 'Shakers and Movers',
    description: 'Refreshing drinks & shakes',
    emoji: '🥤',
    color: 'shakers',
    categories: ['Shakes', 'Juices', 'Coffees', 'Special Drinks'],
    items: [
      // Shakes
      {
        id: 's1',
        name: 'Chocolate Shake',
        description: 'Rich chocolate milkshake with whipped cream',
        price: 119,
        category: 'Shakes',
        image: '🥤',
        isVeg: true,
        popular: true
      },
      {
        id: 's2',
        name: 'Vanilla Shake',
        description: 'Creamy vanilla milkshake with ice cream',
        price: 109,
        category: 'Shakes',
        image: '🥤',
        isVeg: true,
        popular: false
      },
      {
        id: 's3',
        name: 'Strawberry Shake',
        description: 'Fresh strawberry milkshake with fruit pieces',
        price: 129,
        category: 'Shakes',
        image: '🥤',
        isVeg: true,
        popular: true
      },
      // Juices
      {
        id: 's4',
        name: 'Fresh Orange Juice',
        description: 'Freshly squeezed orange juice with pulp',
        price: 79,
        category: 'Juices',
        image: '🧃',
        isVeg: true,
        popular: true
      },
      {
        id: 's5',
        name: 'Mixed Fruit Juice',
        description: 'Blend of seasonal fruits - apple, orange, grapes',
        price: 89,
        category: 'Juices',
        image: '🧃',
        isVeg: true,
        popular: false
      },
      {
        id: 's6',
        name: 'Watermelon Juice',
        description: 'Fresh watermelon juice with mint and black salt',
        price: 69,
        category: 'Juices',
        image: '🧃',
        isVeg: true,
        popular: true
      },
      // Coffees
      {
        id: 's7',
        name: 'Cappuccino',
        description: 'Rich espresso with steamed milk and foam',
        price: 99,
        category: 'Coffees',
        image: '☕',
        isVeg: true,
        popular: true
      },
      {
        id: 's8',
        name: 'Iced Coffee',
        description: 'Cold brew coffee with ice and cream',
        price: 89,
        category: 'Coffees',
        image: '☕',
        isVeg: true,
        popular: false
      },
      // Special Drinks
      {
        id: 's9',
        name: 'Protein Shake',
        description: 'Banana, oats, protein powder, and almond milk',
        price: 159,
        category: 'Special Drinks',
        image: '🥤',
        isVeg: true,
        popular: true
      },
      {
        id: 's10',
        name: 'Energy Drink',
        description: 'Natural energy blend with herbs and vitamins',
        price: 139,
        category: 'Special Drinks',
        image: '🥤',
        isVeg: true,
        popular: false
      }
    ]
  }
}