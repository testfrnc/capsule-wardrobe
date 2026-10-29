"use client";

import { FormEvent, useState } from "react";

type DemoAccount = {
  role: "user" | "owner";
  name: string;
  email: string;
  password: string;
};

type ClothingCategory = "tops" | "bottoms" | "layers" | "shoes" | "accessories";

type WardrobeItem = {
  id: string;
  name: string;
  category: ClothingCategory;
};

const clothingCategories: { id: ClothingCategory; label: string }[] = [
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "layers", label: "Layers" },
  { id: "shoes", label: "Shoes" },
  { id: "accessories", label: "Accessories" },
];

const demoAccounts: DemoAccount[] = [
  {
    role: "user",
    name: "Alex Morgan",
    email: "alex@example.com",
    password: "user123",
  },
  {
    role: "owner",
    name: "Jordan Lee",
    email: "owner@example.com",
    password: "owner123",
  },
];

export default function Home() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [activeAccount, setActiveAccount] = useState<DemoAccount | null>(null);
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadCategory, setUploadCategory] = useState<ClothingCategory>("tops");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [wardrobeMessage, setWardrobeMessage] = useState("");
  const [generatedOutfit, setGeneratedOutfit] = useState<WardrobeItem[] | null>(null);

  function signIn(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const account = demoAccounts.find(
      (demo) =>
        demo.email === email.trim().toLowerCase() && demo.password === password,
    );

    if (!account) {
      setMessage("Email or password is incorrect.");
      return;
    }

    setMessage("");
    setActiveAccount(account);
  }

  function addClothes(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (selectedFiles.length === 0) return;

    const newItems = selectedFiles.map((file, index) => ({
      id: `${Date.now()}-${index}`,
      name: file.name.replace(/\.[^/.]+$/, ""),
      category: uploadCategory,
    }));

    setWardrobe((items) => [...items, ...newItems]);
    setWardrobeMessage(
      `${newItems.length} ${newItems.length === 1 ? "item" : "items"} added to your demo wardrobe. Images are not uploaded or saved.`,
    );
    setGeneratedOutfit(null);
    setSelectedFiles([]);
    setIsUploadOpen(false);
  }

  function generateOutfit() {
    if (wardrobe.length === 0) {
      setWardrobeMessage("Your wardrobe is empty. Upload a clothing item first, then you can generate an outfit.");
      setGeneratedOutfit(null);
      return;
    }

    const outfit = clothingCategories
      .map(({ id }) => wardrobe.find((item) => item.category === id))
      .filter((item): item is WardrobeItem => item !== undefined);
    setGeneratedOutfit(outfit);
    setWardrobeMessage("");
  }

  if (activeAccount) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-4 py-6 text-[#202b24] sm:px-8 sm:py-10">
        <div className="mx-auto max-w-6xl">
          <header className="flex items-center justify-between border-b border-[#e7e4dc] pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#536b58]/40 font-serif text-lg text-[#30483a]">
                e
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.24em]">The Edit</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden text-sm text-[#72766f] sm:inline">
                {activeAccount.name}
              </span>
              <button
                type="button"
                onClick={() => {
                  setActiveAccount(null);
                  setWardrobe([]);
                  setGeneratedOutfit(null);
                  setWardrobeMessage("");
                }}
                className="rounded-full border border-[#d9d9d0] px-4 py-2 text-sm font-medium text-[#30483a] transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-[#536b58]/15"
              >
                Log out
              </button>
            </div>
          </header>

          <section className="py-10 sm:py-14">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b806b]">
              Your wardrobe
            </p>
            <h1 className="font-serif text-4xl tracking-[-0.03em] sm:text-5xl">
              Hello, {activeAccount.name.split(" ")[0]}.
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#72766f]">
              Your favorite pieces, all in one place.
            </p>
          </section>

          <section aria-label="Clothing counts" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <div className="rounded-2xl border border-[#e7e4dc] bg-white p-5">
              <p className="font-serif text-3xl">{wardrobe.length}</p>
              <p className="mt-1 text-sm text-[#72766f]">Total pieces</p>
            </div>
            {clothingCategories.map(({ id, label }) => (
              <div key={id} className="rounded-2xl border border-[#e7e4dc] bg-white p-5">
                <p className="font-serif text-3xl">{wardrobe.filter((item) => item.category === id).length}</p>
                <p className="mt-1 text-sm text-[#72766f]">{label}</p>
              </div>
            ))}
          </section>

          <section className="mt-8 grid gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setSelectedFiles([]);
                setIsUploadOpen(true);
              }}
              className="flex min-h-24 items-center justify-between rounded-2xl bg-[#30483a] px-6 py-5 text-left text-white transition hover:bg-[#24392e] focus:outline-none focus:ring-4 focus:ring-[#536b58]/25"
            >
              <span>
                <span className="block font-serif text-2xl">Upload Clothes</span>
                <span className="mt-1 block text-sm text-white/70">Add pieces to your wardrobe</span>
              </span>
              <span aria-hidden="true" className="text-2xl">＋</span>
            </button>
            <button
              type="button"
              onClick={generateOutfit}
              className="flex min-h-24 items-center justify-between rounded-2xl border border-[#d9d9d0] bg-white px-6 py-5 text-left transition hover:border-[#536b58] hover:bg-[#fcfbf8] focus:outline-none focus:ring-4 focus:ring-[#536b58]/15"
            >
              <span>
                <span className="block font-serif text-2xl">Generate Outfit</span>
                <span className="mt-1 block text-sm text-[#72766f]">Put your pieces together</span>
              </span>
              <span aria-hidden="true" className="text-2xl text-[#536b58]">✳</span>
            </button>
          </section>

          {wardrobe.length === 0 ? (
            <section className="mt-8 rounded-2xl border border-dashed border-[#d9d9d0] bg-white/70 px-6 py-10 text-center sm:py-14">
              <p aria-hidden="true" className="text-3xl">♧</p>
              <h2 className="mt-3 font-serif text-2xl">Your wardrobe is ready for its first piece</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#72766f]">
                Upload a photo of something you love wearing. We’ll keep track of your pieces here.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedFiles([]);
                  setIsUploadOpen(true);
                }}
                className="mt-5 text-sm font-semibold text-[#30483a] underline underline-offset-4 hover:text-[#536b58]"
              >
                Upload your first item
              </button>
            </section>
          ) : (
            <section className="mt-8 rounded-2xl border border-[#e7e4dc] bg-white p-6 sm:p-8">
              <h2 className="font-serif text-2xl">Your clothes</h2>
              <ul className="mt-4 divide-y divide-[#eeede8]">
                {wardrobe.map((item) => (
                  <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                    <span className="truncate">{item.name}</span>
                    <span className="shrink-0 capitalize text-[#72766f]">{item.category}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p aria-live="polite" className="mt-4 min-h-6 text-center text-sm text-[#536b58]">
            {wardrobeMessage}
          </p>

          {generatedOutfit && (
            <section aria-live="polite" className="mt-4 rounded-2xl border border-[#d9d9d0] bg-white p-6 sm:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b806b]">
                Your outfit
              </p>
              <h2 className="mt-2 font-serif text-2xl">Made from your wardrobe</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {generatedOutfit.map((item) => (
                  <li key={item.id} className="rounded-full bg-[#f7f5f0] px-4 py-2 text-sm">
                    {item.name} <span className="capitalize text-[#72766f]">· {item.category}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {isUploadOpen && (
            <div
              className="fixed inset-0 z-20 flex items-center justify-center bg-[#202b24]/40 p-4"
              role="presentation"
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setIsUploadOpen(false);
                  setSelectedFiles([]);
                }
              }}
            >
              <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="upload-title"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b806b]">
                  Add to your wardrobe
                </p>
                <h2 id="upload-title" className="mt-2 font-serif text-3xl">Upload clothes</h2>
                <form className="mt-6 space-y-5" onSubmit={addClothes}>
                  <div>
                    <label htmlFor="category" className="mb-2 block text-sm font-medium">
                      Clothing type
                    </label>
                    <select
                      id="category"
                      value={uploadCategory}
                      onChange={(event) => setUploadCategory(event.target.value as ClothingCategory)}
                      className="h-12 w-full rounded-xl border border-[#e4e3dc] bg-[#fcfbf8] px-3 text-sm outline-none focus:border-[#536b58] focus:ring-4 focus:ring-[#536b58]/10"
                    >
                      {clothingCategories.map(({ id, label }) => (
                        <option key={id} value={id}>{label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="clothing-photos" className="mb-2 block text-sm font-medium">
                      Choose clothing photos
                    </label>
                    <input
                      id="clothing-photos"
                      type="file"
                      accept="image/*"
                      multiple
                      required
                      onChange={(event) => setSelectedFiles(Array.from(event.target.files ?? []))}
                      className="block w-full text-sm text-[#72766f] file:mr-3 file:rounded-lg file:border-0 file:bg-[#f1f0eb] file:px-3 file:py-2 file:text-sm file:font-medium file:text-[#30483a] hover:file:bg-[#e8e7df]"
                    />
                    <p className="mt-2 text-xs leading-5 text-[#999b94]">
                      Demo only: images stay in your browser and are not uploaded or saved.
                    </p>
                  </div>
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsUploadOpen(false);
                        setSelectedFiles([]);
                      }}
                      className="h-12 flex-1 rounded-xl border border-[#d9d9d0] text-sm font-medium text-[#30483a] hover:bg-[#f7f5f0]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={selectedFiles.length === 0}
                      className="h-12 flex-1 rounded-xl bg-[#30483a] text-sm font-semibold text-white hover:bg-[#24392e] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add to wardrobe
                    </button>
                  </div>
                </form>
              </section>
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] p-4 text-[#202b24] sm:p-6 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(47,54,46,0.10)] lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative flex min-h-[340px] flex-col justify-between overflow-hidden bg-[#253b31] p-8 text-white sm:p-12 lg:min-h-[720px] lg:p-16">
          <div className="absolute -right-20 top-24 h-72 w-72 rounded-full border border-white/10 sm:right-0 sm:top-16 sm:h-96 sm:w-96" />
          <div className="absolute -right-4 top-40 h-56 w-56 rounded-full border border-white/10 sm:right-16 sm:top-32 sm:h-72 sm:w-72" />
          <div className="absolute bottom-28 right-10 h-40 w-40 rounded-full bg-[#b5a786]/10 blur-2xl sm:bottom-36 sm:right-20 sm:h-56 sm:w-56" />

          <div className="relative z-10 inline-flex w-fit items-center gap-3" aria-label="The Edit">
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 font-serif text-lg">
              e
            </span>
            <span className="text-xs font-medium uppercase tracking-[0.24em]">The Edit</span>
          </div>

          <div className="relative z-10 my-10 max-w-lg">
            <p className="mb-5 text-xs font-medium uppercase tracking-[0.24em] text-[#c8c0aa]">
              Less, but so much better
            </p>
            <h1 className="font-serif text-5xl leading-[1.08] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
              Make room for
              <br />
              <span className="italic text-[#d3c8ad]">your style.</span>
            </h1>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/70 sm:text-base">
              A thoughtful wardrobe starts with the pieces you love. Pick up
              where your good outfits begin.
            </p>
          </div>

          <div className="relative z-10 flex items-end justify-between gap-6">
            <div>
              <p className="font-serif text-2xl italic text-[#d3c8ad]">Wear what matters.</p>
              <p className="mt-2 text-xs tracking-wide text-white/50">Your personal style, thoughtfully kept.</p>
            </div>
            <div className="hidden h-36 w-28 rotate-[-8deg] items-center justify-center rounded-t-full border border-white/20 bg-[#d2c5a6]/10 sm:flex">
              <span className="font-serif text-5xl italic text-white/70">01</span>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#8b806b]">
                Welcome back
              </p>
              <h2 className="font-serif text-4xl tracking-[-0.03em] sm:text-5xl">Sign in</h2>
              <p className="mt-4 text-sm leading-6 text-[#72766f]">
                Sign in with one of the demo accounts to continue.
              </p>
            </div>

            <form className="space-y-5" onSubmit={signIn}>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium">
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="username"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                      className="h-14 w-full rounded-xl border border-[#e4e3dc] bg-[#fcfbf8] px-4 text-sm outline-none transition placeholder:text-[#a5a69f] focus:border-[#536b58] focus:ring-4 focus:ring-[#536b58]/10"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between gap-4">
                      <label htmlFor="password" className="text-sm font-medium">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMessage("Password recovery is not available in demo mode.")}
                        className="text-xs font-medium text-[#536b58] transition hover:text-[#253b31]"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        required
                        className="h-14 w-full rounded-xl border border-[#e4e3dc] bg-[#fcfbf8] px-4 pr-20 text-sm outline-none transition placeholder:text-[#a5a69f] focus:border-[#536b58] focus:ring-4 focus:ring-[#536b58]/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        className="absolute inset-y-0 right-4 text-xs font-medium text-[#74786f] hover:text-[#253b31]"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="flex h-14 w-full items-center justify-center rounded-xl bg-[#30483a] px-5 text-sm font-semibold text-white transition hover:bg-[#24392e] focus:outline-none focus:ring-4 focus:ring-[#536b58]/25"
                  >
                    Sign in
                    <span aria-hidden="true" className="ml-2 text-lg">→</span>
                  </button>
                  <p aria-live="polite" className="min-h-5 text-sm text-[#8b6045]">
                    {message}
                  </p>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}
