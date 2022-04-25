const html = htm.bind(preact.h);

const translations = {
  fr: {
    search: "Rechercher par nom, description...",
    detail: "Détail",
    addToCart: "Ajouter au panier",
  },
};

let globalValues = {
  loaded: 0,
  currency: "",
};

let MAX = 10;

const language = WebApp.initDataUnsafe.language_code;
const t = translations[language] ?? translations.fr;
const defaultFilters = [t.chicken, t.tacos, t.pizza];

function isTouchDevice() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

if (isTouchDevice()) {
  document.body.classList.add("mobile");
}

function initData() {
  WebApp.MainButton.disable();
  WebApp.MainButton.color = WebApp.themeParams.hint_color;

  return {
    firstname: WebApp.initDataUnsafe.user.first_name,
    lastname: WebApp.initDataUnsafe.user.last_name,
  };
}

function Cart({ cart, onBackToMenu, restaurant }) {
  const [total] = preactHooks.useState(calculatePrice(cart));
  const [data, setData] = preactHooks.useState(initData());

  const onDeliveryClick = (v) => {
    setDelivery(v);
  };

  preactHooks.useEffect(() => {
    WebApp.MainButton.text = `${t.pay} ${total} ${restaurant.currency}`;

    if (delivery !== "home") {
      if (data.firstname && data.lastname) {
        WebApp.MainButton.enable();
        WebApp.MainButton.color = WebApp.themeParams.button_color;
      } else {
        WebApp.MainButton.disable();
        WebApp.MainButton.color = WebApp.themeParams.hint_color;
      }

      return;
    }

    if (
      data.firstname &&
      data.lastname &&
      data.address &&
      data.zipcode &&
      data.city &&
      total >= restaurant.minimumAmountForDelivery
    ) {
      WebApp.MainButton.enable();
      WebApp.MainButton.color = WebApp.themeParams.button_color;
    } else {
      WebApp.MainButton.disable();
      WebApp.MainButton.color = WebApp.themeParams.hint_color;
    }
  }, [data, delivery, total, restaurant.minimumAmountForDelivery]);

  preactHooks.useEffect(() => {
    setTimeout(() => {
      WebApp.MainButton.show();
    }, 250);

    return () => {
      WebApp.MainButton.color = WebApp.themeParams.button_color;
    };
  });

  const onInput = (e) => {
    const name = e.currentTarget.name;
    const value = e.currentTarget.value;
    setData((d) => ({ ...data, [name]: value }));
  };

  return html`
    <div class="fill">
      <div class="flex justify-between items-center mb-8 h-padding mt-8">
        <p class="mt-0 mb-0">${t.yourOrder}</p>
        <a class="link_color mt-0" onClick=${onBackToMenu}>${t.edit}</a>
      </div>
      <p
        class="hint_color h-padding mb-0"
        style="font-size: 12px; margin-top: 16px"
      >
        ${t.chooseDelivery}
      </p>
      <div class="flex">
        <p
          class=${`round-button nowrap ml-16 mb-0 ${
            delivery === "home" ? "round-button--selected" : ""
          }`}
          onClick=${() => onDeliveryClick("home")}
        >
          ${t.homeDelivery}
        </p>
        <p
          class=${`round-button nowrap ml-16 mb-0 ${
            delivery === "withdraw" ? "round-button--selected" : ""
          }`}
          onClick=${() => onDeliveryClick("withdraw")}
        >
          ${t.withdraw}
        </p>
      </div>
      ${delivery === "home" &&
      html`
        <p
          class="hint_color h-padding mb-0"
          style="font-size: 12px; margin-top: 16px"
        >
          ${t.minimumAmount}
        </p>
        <p class=" h-padding">
          ${restaurant.minimumAmountForDelivery} ${restaurant.currency}
        </p>
      `}

      <p
        class="hint_color h-padding mb-0"
        style="font-size: 12px; margin-top: 16px"
      >
        ${t.products}
      </p>
      ${cart.map(({ choices, variant, quantity }) => {
        let price = variant.price;
        const keys = Object.keys(choices);
        const names = [];
        for (const key of keys) {
          const options = choices[key];
          for (const option of options) {
            names.push(option.name);
            price += option.price;
          }
        }
        const description = names.join(", ");
        price *= quantity;

        return html`
          <div class="flex justify-between items-center h-padding">
            <div class="fill">
              <p class="mb-0">${variant.name} ${quantity}x</p>
              <p class="mt-0 hint_color" style="font-size:12px">
                ${description}
              </p>
            </div>
            <p>${price} ${globalValues.currency}</p>
          </div>
        `;
      })}
      <p class="hint_color h-padding mb-0 mt-4" style="font-size: 12px;">
        ${t.info}
      </p>
      <div class="mt-16">
        <input
          type="text"
          name="firstname"
          placeholder=${t.firstname}
          value=${data.firstname}
          onInput=${onInput}
          class="input"
        />
      </div>
      <div class="mt-4">
        <input
          type="text"
          name="lastname"
          value=${data.lastname}
          placeholder=${t.lastname}
          onInput=${onInput}
          class="input"
        />
      </div>
      <div class="mt-4">
        <input
          type="text"
          name="instructions"
          value=${data.instructions}
          placeholder=${t.instructions}
          onInput=${onInput}
          class="input"
        />
      </div>
      ${delivery === "home" &&
      html`
        <div class="mt-4">
          <input
            type="text"
            name="address"
            value=${data.address}
            placeholder=${t.address}
            onInput=${onInput}
            class="input"
          />
        </div>

        <div class="mt-4">
          <input
            type="text"
            name="zipcode"
            value=${data.zipcode}
            placeholder=${t.zipcode}
            onInput=${onInput}
            class="input"
          />
        </div>

        <div class="mt-4 mb-8">
          <input
            type="text"
            name="city"
            placeholder=${t.city}
            value=${data.city}
            class="input"
            onInput=${onInput}
          />
        </div>
      `}
    </div>
  `;
}

async function getProducts() {
  return [
    {
      id: 1,
      title: "NATAAIJ AL-FIKR FI NAHWI - ABOU AL-QASIM AS-SOUHAYLI",
      image:
        "https://www.sifatusafwa.com/26244-home_default/nataaij-al-fikr-fi-nahwi-abou-al-qasim-as-souhayli.jpg",
      description:
        "As-Suhayli a déclaré : « Notre objectif est de disposer « Nataaij al-Fikr » selon les chapitres du livre « al-Jumal », en raison de l’estime que les gens lui porte. »",
      price: 24,
    },
    {
      id: 2,
      title: "NATAAIJ AL-FIKR FI NAHWI - ABOU AL-QASIM AS-SOUHAYLI",
      image:
        "https://www.sifatusafwa.com/26244-home_default/nataaij-al-fikr-fi-nahwi-abou-al-qasim-as-souhayli.jpg",
      description:
        "As-Suhayli a déclaré : « Notre objectif est de disposer « Nataaij al-Fikr » selon les chapitres du livre « al-Jumal », en raison de l’estime que les gens lui porte. »",
      price: 24,
    },
  ];
}

function Products({ onDetailClick }) {
  const [products, setProducts] = preactHooks.useState([]);

  preactHooks.useEffect(() => {
    getProducts().then((p) => setProducts(p));
  }, []);

  return html`<div>
    <input type="search" class="input" placeholder=${t.search} />

    <div class="products mx-22 mt-16">
      ${products.map(
        (product) => html`
          <div
            key=${product.id}
            class="flex column product mb-24"
            onDetailClick=${() => onDetailClick(product)}
          >
            <div class="flex justify-center">
              <img src=${product.image} style="width: auto;" height="300" />
            </div>
            <p class="mb-0">${product.title}</p>
            <p class="mt-4 hint_color small">${product.description}</p>
            <a
              class="button_color button "
              onClick=${() => onDetailClick(product)}
              >${t.detail}</a
            >
          </div>
        `
      )}
    </div>
  </div>`;
}

function ProductDetail({ product }) {
  return html`
    <div class="products mx-22 mt-16">
      <div key=${product.id} class="flex column product mb-24">
        <div class="flex justify-center">
          <img src=${product.image} style="width: auto;" height="300" />
        </div>
        <p class="mb-0">${product.title}</p>
        <p class="mt-4 hint_color small">${product.description}</p>
        <a class="button_color button ">${t.addToCart}</a>
      </div>
    </div>
  `;
}

function App() {
  const [cart, setCart] = preactHooks.useState([]);
  const [isCartVisible, setIsCartVisible] = preactHooks.useState(false);
  const [product, setProduct] = preactHooks.useState(null);

  const onDetailClick = preactHooks.useCallback((p) => {
    setProduct(p);
  }, []);

  if (product) {
    return html`<${ProductDetail} product=${product} />`;
  }

  return html`<${Products} onDetailClick=${onDetailClick} />`;
}

const root = document.getElementById("root");
preact.render(html`<${App} name="World" />`, root);

WebApp.ready();
