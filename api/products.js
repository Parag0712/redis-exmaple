
export const getProducts = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: "iPhone 12",
          price: 999,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 2,
          name: "iPhone 12 Pro",    
          price: 999,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 3,
          name: "iPhone 12 Pro Max",
          price: 999,
          image: "https://via.placeholder.com/150",
        },
      ]);
    }, 4000);
  });

export const getProduct = (id) =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: id,
        name: `product ${id}`,
        price: 999,
      });
    }, 2000);
  });
