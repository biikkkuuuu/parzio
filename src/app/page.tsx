import Image from "next/image";

const categories = [
  {
    name: "Skincare",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwj3MQ1HuZiM4Z8BX0ZF-OHrdxgy_l7r9xT2pcczDY5JhvtYz5HNj-_vRBcRI8TYl4OZRt7w2Rjw2H7cyrPxEXtbCEg0sTyQlamJNbT6Lb6FNYDTE0NBFuVpzIJxghAYN9BRPHc0uSAArDJpPsdrit6whdX4UsHezPsGpc1sKC1i8Xs4I2UkK45y4ozpA1giojeujz-6CfrIXdBO3SXg0XoWW-iW_diSAEhz0a7SEKi1PuAC6vecnw",
  },
  {
    name: "Makeup",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkiJ6i9F7Kjw0znbIPlJ2iFqKNfYCK7fnZokHwOMp1o_Fidm5Ol2-q_isH2-DC1Hte31H5E88WNlrRamcPTGR_aAfZ3ekjI8KJbY35d0JjRJ7J5V8QigLKAcQO__N1bEtK1RZ_rkxeU0lwPvXfgvrQ62uwzuUs1H6ZRFpMUV4cZCGJWYCijCDQ7HwgFfSpWZxjLI81vfvJYLdkyA2Z3I6N2to-1DvXuSKUQ64WG8pRqTjFMf71gJ3G",
  },
  {
    name: "Haircare",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjFw6EJsmSMqiASCKp0bhVkmsDWeM8NLExEZkavMSnrTJo8HKVgRImPJ11fsCyksI1rM_0NF7eFVCOisDoJQ9D0pKZXZpyorIVjIT-bN-0NFF3atZPFewZeNThXsbywAC3So21Np5YQTZiHaTuqmpb158U8ubxhkZ2uRhyaGYVM_Ttm7SlCVJQCKoAKCNMsv8TpSH_I5UuCHzIfdTM4qVHpj4T50NhOkBVbEaQHt1YA4vri8G_OrkF",
  },
  {
    name: "Fragrance",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBmtaUSM61MW21d2u9bvPScHINhPg_QPANp65wZo2B4biPqujiQYExCaS1RslX00T3FtTrZJNofmpR1HY9sDX879YfWZePI-_aoHaD30hClsa_9jpmo-MtP8HaFNY-YDp3nEs-T1shtUa8yMy8EtKQoAO0EgGLiJoqWicq8NU_7vNKxvNqYYZuIn84sgzlW9KH0i5BNYotT7r8ChF9AEdNq8cYSulI9YElhX3FdxcQlME2XyPznqftr",
  },
  {
    name: "Body Care",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA18_a-XBAEjDo6f0ashD46r3MtujfmkrAHg-PjjR1JXHH5Pk6hiB3LfvOGEfsQKVlqA7W76Bu42NGj7BYrOuCOq6AG85D9BkUHiCP7iNioMnlSgu42flSVkWA0bLbiMsZlC_shTfIur10bxVsHMk2qab65SIjw2gvthoTchnwAgCLXpxYZsEVECLjXLdxpJQS8yTAV8H-VD4gBPnFOXAOr2qYNfuLbua08K7YcY_NIUJlT94QhSRDe",
  },
];

const heroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuACovNpP6oU2y42stT5pWXb7izgJFjhByjJp1rmCVf5UMQ8qhLVjsJX30-JkDgcQ1Bt2Ul-n2pEnwd3cWv08bOPuAb30R-bFkr6z-WFipdOk1da6j1SEK1Xqa-sIhSEr4D-WvvIpu2tMsGNC2y9qWgYlNKH3Esc-j6uVTXfkwpAXd7W90eWI6R9R1e3Oi_QKk7CT_Ipl-nyYcxCtPcm8QBDEYjyck3tqgEaM3EHquS_c4XrEC0Ps22O";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b]">
      {/* Announcement */}
      <div className="bg-[#431830] px-4 py-2 text-center text-xs font-bold tracking-wider text-white">
        Free Delivery on orders above ₹999{" "}
        <a href="#" className="ml-2 underline">
          Shop Now
        </a>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[#d4c2c8] bg-[#fcf9f8]/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between gap-6">
            <a href="/" className="text-2xl font-bold tracking-[0.2em] text-[#431830]">
              PARZIO
            </a>

            <div className="relative hidden flex-1 md:block">
              <span className="absolute left-4 top-1/2 -translate-y-1/2">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search for products, brands, or concerns..."
                className="w-full rounded-lg border border-[#d4c2c8] bg-white py-3 pl-11 pr-4 outline-none focus:border-[#431830]"
              />
            </div>

            <div className="flex items-center gap-4 text-xl text-[#504348]">
              <button aria-label="Account">👤</button>
              <button aria-label="Wishlist">♡</button>
              <button className="relative" aria-label="Cart">
                🛍
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#431830] text-[10px] text-white">
                  3
                </span>
              </button>
            </div>
          </div>

          <nav className="mt-4 hidden justify-center gap-8 text-xs font-bold uppercase tracking-wider text-[#504348] md:flex">
            <a href="#">Skincare</a>
            <a href="#">Makeup</a>
            <a href="#">Fragrance</a>
            <a href="#">Haircare</a>
            <a href="#">Bath & Body</a>
            <a href="#">Wellness</a>
          </nav>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 py-6">
          <div className="relative flex min-h-[500px] items-center overflow-hidden rounded-lg">
            <Image
              src={heroImage}
              alt="Premium skincare products"
              fill
              priority
              className="object-cover"
            />

            <div className="relative z-10 max-w-xl p-8 md:p-12">
              <h1 className="mb-4 text-4xl font-semibold leading-tight text-[#431830] md:text-6xl">
                Summer Skin
                <br />
                Revival
              </h1>

              <p className="mb-6 text-lg leading-7 text-[#504348]">
                Discover the season&apos;s most coveted hydration heroes and sun
                protection essentials for a flawless, radiant glow.
              </p>

              <button className="rounded bg-[#5d2e46] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-[#431830]">
                Shop the Sale →
              </button>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="mx-auto max-w-7xl px-6 py-12">
          <h2 className="mb-10 text-center text-2xl font-medium">
            Shop by Category
          </h2>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-5">
            {categories.map((category) => (
              <a
                key={category.name}
                href="#"
                className="group flex flex-col items-center gap-4 text-center"
              >
                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-[#d4c2c8]">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <span className="text-xs font-bold uppercase tracking-wider group-hover:text-[#431830]">
                  {category.name}
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-[#eae7e7] px-6 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-xl font-bold tracking-widest text-[#431830]">
              PARZIO
            </h3>
            <p className="text-sm leading-6 text-[#504348]">
              Elevating your daily ritual with curated, premium beauty
              essentials from the world&apos;s most coveted brands.
            </p>
            <p className="mt-4 text-sm text-[#504348]">
              © 2026 PARZIO. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#431830]">
              Company
            </h4>
            <div className="flex flex-col gap-3 text-sm text-[#504348]">
              <a href="#">About Us</a>
              <a href="#">Store Locator</a>
              <a href="#">Contact Us</a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#431830]">
              Support
            </h4>
            <div className="flex flex-col gap-3 text-sm text-[#504348]">
              <a href="#">Shipping & Returns</a>
              <a href="#">FAQ</a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-wider text-[#431830]">
              Legal
            </h4>
            <div className="flex flex-col gap-3 text-sm text-[#504348]">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}