import { FormEvent, useEffect, useRef, useState } from "react";

type Page = "home" | "about" | "collections" | "contact" | "faq";
type Dialog = "login" | "signup" | "booking" | null;

const features = [
  {
    number: "01",
    title: "EXCLUSIVE COLLECTION",
    copy: "Hand-selected supercars and grand tourers, maintained to perfection",
  },
  {
    number: "02",
    title: "PREMIUM EXPERIENCE",
    copy: "From first click to final handover, every detail is effortless",
  },
  {
    number: "03",
    title: "PERSONALIZED SERVICE",
    copy: "Delivered to your door, tailored to your journey, available 24/7",
  },
];

const pageCopy: Record<
  Exclude<Page, "home" | "about" | "collections" | "contact">,
  { eyebrow: string; title: string; copy: string }
> = {
  faq: {
    eyebrow: "YOUR QUESTIONS, ANSWERED",
    title: "Frequently Asked Questions",
    copy: "Our concierge will assist with eligibility, delivery, deposits and tailored drive arrangements.",
  },
};

export default function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname));
  const [dialog, setDialog] = useState<Dialog>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.body.style.overflow = dialog ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [dialog]);

  useEffect(() => {
    const handlePopState = () => {
      setPage(pageFromPath(window.location.pathname));
      setMenuOpen(false);
      window.scrollTo({ top: 0 });
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextPage: Page) => {
    const nextPath = nextPage === "home" ? "/" : `/${nextPage}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setPage(nextPage);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openDialog = (nextDialog: Dialog) => {
    setSubmitted(false);
    setDialog(nextDialog);
    setMenuOpen(false);
  };

  return (
    <main className="site-shell">
      <header className="site-header">
        <button className="brand" onClick={() => navigate("home")} aria-label="NOIR MOTORS home">
          NOIR MOTORS
        </button>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen((current) => !current)}
          aria-expanded={menuOpen}
          aria-controls="site-navigation"
        >
          <span />
          <span />
          <span />
          <span className="sr-only">Toggle navigation</span>
        </button>

        <div className={`navigation-wrap ${menuOpen ? "is-open" : ""}`} id="site-navigation">
          <nav className="primary-nav" aria-label="Primary navigation">
            <NavButton active={page === "home"} onClick={() => navigate("home")}>
              Home
            </NavButton>
            <NavButton active={page === "about"} onClick={() => navigate("about")}>
              About
            </NavButton>
            <NavButton active={page === "collections"} onClick={() => navigate("collections")}>
              Collections
            </NavButton>
            <NavButton active={page === "contact"} onClick={() => navigate("contact")}>
              Contact
            </NavButton>
            <NavButton active={page === "faq"} onClick={() => navigate("faq")}>
              FAQs
            </NavButton>
          </nav>
          {page === "collections" ? (
            <CollectionReserveMenu onAction={() => setMenuOpen(false)} />
          ) : (
            <div className="account-actions">
              <button className="account-button login-button" onClick={() => openDialog("login")}>
                Log In
              </button>
              <button className="account-button signup-button" onClick={() => openDialog("signup")}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </header>

      {page === "home" && <Home onNavigate={navigate} onBook={() => openDialog("booking")} />}
      {page === "about" && <AboutPage onBook={() => openDialog("booking")} />}
      {page === "collections" && <CollectionsPage />}
      {page === "contact" && <ContactPage />}
      {page === "faq" && (
        <FaqPage
          onContact={() => {
            navigate("contact");
            window.setTimeout(
              () =>
                document
                  .getElementById("contact-enquiry")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" }),
              120,
            );
          }}
        />
      )}

      {dialog && (
        <DialogPanel
          type={dialog}
          submitted={submitted}
          onClose={() => setDialog(null)}
          onSubmit={() => setSubmitted(true)}
        />
      )}
    </main>
  );
}

function CollectionReserveMenu({ onAction }: { onAction: () => void }) {
  const detailsRef = useRef<HTMLDetailsElement>(null);

  const goTo = (target: "all" | "choose" | "book") => {
    detailsRef.current?.removeAttribute("open");
    onAction();

    if (target === "all") {
      document.querySelector<HTMLButtonElement>('[data-collection-filter="ALL"]')?.click();
      document.getElementById("collections-grid")?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    document.getElementById("collections-booking")?.scrollIntoView({ behavior: "smooth" });
    if (target === "choose") {
      window.setTimeout(() => document.getElementById("booking-car")?.focus(), 650);
    }
  };

  return (
    <details className="collection-reserve-menu" ref={detailsRef}>
      <summary>RESERVE</summary>
      <div>
        <button onClick={() => goTo("all")}>Browse All Cars</button>
        <button onClick={() => goTo("choose")}>Choose a Car</button>
        <button onClick={() => goTo("book")}>Book Your Drive</button>
      </div>
    </details>
  );
}

function pageFromPath(pathname: string): Page {
  const route = pathname.replace(/^\/+|\/+$/g, "").toLowerCase();
  if (route === "about" || route === "collections" || route === "contact" || route === "faq") {
    return route;
  }
  return "home";
}

function NavButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button className={`nav-link ${active ? "active" : ""}`} onClick={onClick}>
      {children}
    </button>
  );
}

function Home({ onNavigate, onBook }: { onNavigate: (page: Page) => void; onBook: () => void }) {
  return (
    <div className="home-page">
      <div className="ambient ambient-one">
        <img src="/assets/8df61.svg" alt="" />
      </div>
      <div className="ambient ambient-two">
        <img src="/assets/1c0dd.svg" alt="" />
      </div>
      <div className="ambient ambient-three">
        <img src="/assets/f9cb5.svg" alt="" />
      </div>

      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-copy">
          <h1 id="hero-title" className="hero-title">
            <span>Not just a drive.</span>
            <em>An arrival.</em>
          </h1>
          <div className="hero-subtitle">
            <p>Experience the art of driving.</p>
            <img src="/assets/36931.svg" alt="" />
          </div>
          <div className="hero-actions">
            <button className="cta cta-outline" onClick={() => onNavigate("collections")}>
              <span>EXPLORE</span>
              <span>COLLECTION</span>
            </button>
            <button className="cta cta-filled" onClick={onBook}>
              <span>BOOK YOUR</span>
              <span>DRIVE</span>
            </button>
          </div>
        </div>

        <div className="car-stage" aria-hidden="true">
          <img className="car-image" src="/assets/0b602.png" alt="" />
        </div>
        <div className="car-floor-shadow" aria-hidden="true">
          <img src="/assets/1ade1.svg" alt="" />
        </div>
        <div className="car-reflection" aria-hidden="true">
          <img src="/assets/0b602.png" alt="" />
        </div>
        <div className="reflection-fade" aria-hidden="true" />
      </section>

      <section className="features" aria-label="NOIR MOTORS service highlights">
        <img className="section-rule" src="/assets/158c6.svg" alt="" />
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature" key={feature.number}>
              <h2>
                {feature.number} / {feature.title}
              </h2>
              <p>{feature.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="site-footer">
        <img className="footer-rule" src="/assets/27ab7.svg" alt="" />
        <div>
          <p>NOIR MOTORS</p>
          <p>© 2026</p>
        </div>
        <p className="appointment">KOLKATA · BY APPOINTMENT</p>
      </footer>
    </div>
  );
}

const aboutStats = [
  { value: "50+", label: "VEHICLES" },
  { value: "24/7", label: "CONCIERGE" },
  { value: "10+", label: "CITIES" },
  { value: "100%", label: "PRIVATE SERVICE" },
];

function AboutPage({ onBook }: { onBook: () => void }) {
  return (
    <div className="about-page">
      <div className="about-ambient" aria-hidden="true">
        <img src="/assets/a4989.svg" alt="" />
      </div>

      <section className="about-intro" aria-labelledby="about-title">
        <p className="about-kicker">ABOUT NOIR MOTORS</p>
        <h1 id="about-title">
          Built for those
          <span>
            who <em>arrive.</em>
          </span>
        </h1>
        <img className="about-title-rule" src="/assets/65ad5.svg" alt="" />
        <p className="about-lead">
          A private collection of the world’s finest cars, delivered with the quiet
          <br className="desktop-only" /> precision of true luxury service.
        </p>
      </section>

      <section className="about-story" aria-labelledby="story-title">
        <div className="about-image-frame">
          <img
            src="/assets/fe5a4.png"
            alt="Aston Martin cockpit with leather steering wheel and centre console"
          />
          <span aria-hidden="true" />
        </div>
        <div className="story-copy">
          <p className="about-kicker">OUR STORY</p>
          <h2 id="story-title">
            More than a rental.
            <span>
              A <em>standard.</em>
            </span>
          </h2>
          <div className="story-body">
            <p>
              Noir Motors began with a simple belief: the journey should feel as extraordinary as
              the destination.We curate supercars and grand tourers that deserve to be driven, and
              we maintain each one to showroom standard.
            </p>
            <p>
              From the first enquiry to the final handover, every detail is handled personally, so
              all you have to do is drive.
            </p>
          </div>
        </div>
      </section>

      <section className="about-stats" aria-label="NOIR MOTORS in numbers">
        <img className="stats-rule stats-rule-top" src="/assets/1204c.svg" alt="" />
        <div className="stats-grid">
          {aboutStats.map((stat, index) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              {index < aboutStats.length - 1 && (
                <img className="stat-divider" src="/assets/65ece.svg" alt="" />
              )}
            </div>
          ))}
        </div>
        <img className="stats-rule stats-rule-bottom" src="/assets/1204c.svg" alt="" />
      </section>

      <section className="about-reserve">
        <h2>
          Reserve your <em>arrival.</em>
        </h2>
        <button onClick={onBook}>BOOK YOUR DRIVE</button>
      </section>

      <footer className="about-footer">
        <img src="/assets/27ab7.svg" alt="" />
        <div>
          <p>NOIR MOTORS</p>
          <p>© 2026</p>
        </div>
        <p>KOLKATA · BY APPOINTMENT</p>
      </footer>
    </div>
  );
}

type CollectionFilter = "ALL" | "SALOON" | "COUPE" | "GRAND TOURER" | "SUV";

type CollectionCar = {
  name: string;
  category: string;
  filter: Exclude<CollectionFilter, "ALL">;
  description: string;
  price: string;
  image: string;
  reflection: string;
  imageClass: string;
};

const collectionFilters: CollectionFilter[] = ["ALL", "SALOON", "GRAND TOURER", "COUPE", "SUV"];

const collectionCars: CollectionCar[] = [
  {
    name: "Aston Martin DB12",
    category: "GRAND TOURER",
    filter: "GRAND TOURER",
    description: "4.0L V8 · 671 hp · 2+2 leather cabin",
    price: "$1,300",
    image: "/assets/5f094.png",
    reflection: "/assets/a17ea.png",
    imageClass: "db12",
  },
  {
    name: "Rolls-Royce Phantom",
    category: "SALOON",
    filter: "SALOON",
    description: "6.75L V12 · 563 hp · Rear-seat lounge",
    price: "$1,450",
    image: "/assets/2221b.png",
    reflection: "/assets/15b5d.png",
    imageClass: "phantom",
  },
  {
    name: "Bentley Continental GT",
    category: "GRAND TOURER",
    filter: "GRAND TOURER",
    description: "4.0L V8 · 542 hp · Hand-stitched interior",
    price: "$980",
    image: "/assets/a2feb.png",
    reflection: "/assets/c403f.png",
    imageClass: "continental",
  },
  {
    name: "Lamborghini Huracán",
    category: "SUPERCAR",
    filter: "COUPE",
    description: "5.2L V10 · 631 hp · 0–100 km/h in 3.2s",
    price: "$1,600",
    image: "/assets/bc545.png",
    reflection: "/assets/32730.png",
    imageClass: "huracan",
  },
  {
    name: "Aston Martin DBX707",
    category: "SUV",
    filter: "SUV",
    description: "4.0L V8 · 697 hp · Five-seat leather cabin",
    price: "$1,150",
    image: "/assets/49362.png",
    reflection: "/assets/d4750.png",
    imageClass: "dbx",
  },
  {
    name: "Ferrari Roma",
    category: "GRAND TOURER",
    filter: "GRAND TOURER",
    description: "3.9L V8 · 612 hp · 2+2 coupé",
    price: "$1,350",
    image: "/assets/b2f4a.png",
    reflection: "/assets/b2f4a.png",
    imageClass: "roma",
  },
  {
    name: "Mercedes-Maybach s 680",
    category: "SALOON",
    filter: "SALOON",
    description: "6.0L V12 · 603 hp · Executive rear seats",
    price: "$1,200",
    image: "/assets/af537.png",
    reflection: "/assets/af537.png",
    imageClass: "maybach",
  },
  {
    name: "Range Rover Autobiography",
    category: "SUV",
    filter: "SUV",
    description: "4.4L V8 · 523 hp · Four-seat option",
    price: "$720",
    image: "/assets/384a5.png",
    reflection: "/assets/384a5.png",
    imageClass: "range-rover",
  },
];

function CollectionsPage() {
  const [filter, setFilter] = useState<CollectionFilter>("ALL");
  const [selectedCar, setSelectedCar] = useState("Any Car");
  const [pickup, setPickup] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [availability, setAvailability] = useState<{
    kind: "error" | "success";
    text: string;
  } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const today = new Date().toISOString().slice(0, 10);
  const returnMinimum = pickup ? nextCalendarDate(pickup) : today;
  const visibleCars =
    filter === "ALL" ? collectionCars : collectionCars.filter((car) => car.filter === filter);

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".collection-card");
    if (!cards) return;
    if (!("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [filter]);

  const reserveCar = (name: string) => {
    setSelectedCar(name);
    setAvailability(null);
    document.getElementById("collections-booking")?.scrollIntoView({ behavior: "smooth" });
  };

  const checkAvailability = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pickup || !returnDate) {
      setAvailability({ kind: "error", text: "Please select both your pick-up and return dates." });
      return;
    }
    if (returnDate <= pickup) {
      setAvailability({ kind: "error", text: "Return date must be after the pick-up date." });
      return;
    }

    const vehicle = selectedCar === "Any Car" ? "A suitable vehicle" : selectedCar;
    setAvailability({
      kind: "success",
      text: `${vehicle} appears available for these dates. This is a frontend availability demonstration; no reservation has been confirmed.`,
    });
  };

  return (
    <div className="collections-page">
      <div className="collections-ambient" aria-hidden="true">
        <img src="/assets/487d3.svg" alt="" />
      </div>

      <section className="collections-intro" aria-labelledby="collections-title">
        <h1 id="collections-title">
          Cars chosen for the
          <span>way you arrive.</span>
        </h1>
        <img src="/assets/eb31f.svg" alt="" />
        <p>
          Eight marques, each maintained to showroom
          <br />
          standard and delivered to your door. Choose a<br />
          car, pick your dates, and we handle the rest.
        </p>
        <div className="collection-filters" aria-label="Filter the car collection">
          {collectionFilters.map((item) => (
            <button
              key={item}
              type="button"
              data-collection-filter={item}
              className={filter === item ? "active" : ""}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item}
              <img src="/assets/985e9.svg" alt="" />
            </button>
          ))}
        </div>
      </section>

      <div className="collections-divider">
        <img src="/assets/aff01.svg" alt="" />
      </div>

      <section className="collection-grid" id="collections-grid" aria-live="polite" ref={gridRef}>
        {visibleCars.map((car) => (
          <article className="collection-card" key={car.name}>
            {car.imageClass === "phantom" && (
              <img className="phantom-frame" src="/assets/7c352.svg" alt="" />
            )}
            <div className={`collection-car-art ${car.imageClass}`}>
              <img className="collection-car-main" src={car.image} alt={car.name} />
              <img className="collection-car-reflection" src={car.reflection} alt="" />
              <span className="collection-reflection-fade" aria-hidden="true" />
            </div>
            <img className="collection-copy-rule" src="/assets/47d42.svg" alt="" />
            <div className="collection-card-copy">
              <p className="collection-category">{car.category}</p>
              <h2>{car.name}</h2>
              <p className="collection-spec">{car.description}</p>
              <div className="collection-card-footer">
                <img src="/assets/64f7d.svg" alt="" />
                <p>
                  <strong>{car.price}</strong> / day
                </p>
                <button type="button" onClick={() => reserveCar(car.name)}>
                  RESERVE
                </button>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="collections-booking" id="collections-booking">
        <form onSubmit={checkAvailability} noValidate>
          <img className="booking-rule booking-rule-one" src="/assets/5c3c5.svg" alt="" />
          <img className="booking-rule booking-rule-two" src="/assets/f8288.svg" alt="" />
          <img className="booking-rule booking-rule-three" src="/assets/5c3c5.svg" alt="" />
          <label>
            <span>CAR</span>
            <select
              id="booking-car"
              value={selectedCar}
              onChange={(event) => {
                setSelectedCar(event.target.value);
                setAvailability(null);
              }}
            >
              <option>Any Car</option>
              {collectionCars.map((car) => (
                <option key={car.name}>{car.name}</option>
              ))}
            </select>
          </label>
          <label>
            <span>PICK-UP</span>
            <input
              type="date"
              min={today}
              value={pickup}
              onChange={(event) => {
                setPickup(event.target.value);
                if (returnDate && returnDate <= event.target.value) setReturnDate("");
                setAvailability(null);
              }}
              required
            />
          </label>
          <label>
            <span>RETURN</span>
            <input
              type="date"
              min={returnMinimum}
              value={returnDate}
              onChange={(event) => {
                setReturnDate(event.target.value);
                setAvailability(null);
              }}
              required
            />
          </label>
          <button type="submit">CHECK AVAILABILITY</button>
          {availability && (
            <p className={`availability-message ${availability.kind}`} role="status">
              {availability.text}
            </p>
          )}
        </form>
      </section>

      <footer className="collections-footer">
        <img src="/assets/27ab7.svg" alt="" />
        <div>
          <p>NOIR MOTORS</p>
          <p>© 2026</p>
        </div>
        <p>KOLKATA · BY APPOINTMENT</p>
      </footer>
    </div>
  );
}

function nextCalendarDate(date: string) {
  const next = new Date(`${date}T00:00:00`);
  next.setDate(next.getDate() + 1);
  return next.toISOString().slice(0, 10);
}

type ContactFormValues = {
  fullName: string;
  phone: string;
  email: string;
  vehicle: string;
  pickupDate: string;
  message: string;
};

const emptyContactForm: ContactFormValues = {
  fullName: "",
  phone: "",
  email: "",
  vehicle: "",
  pickupDate: "",
  message: "",
};

function ContactPage() {
  const [values, setValues] = useState<ContactFormValues>(emptyContactForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormValues, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const today = new Date().toISOString().slice(0, 10);

  const updateField = (field: keyof ContactFormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSubmitted(false);
  };

  const submitEnquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitted) return;

    const nextErrors: Partial<Record<keyof ContactFormValues, string>> = {};
    if (!values.fullName.trim()) nextErrors.fullName = "Please enter your full name.";
    if (!values.phone.trim()) {
      nextErrors.phone = "Please enter your phone number.";
    } else if (!/^\+?[0-9\s()-]{8,20}$/.test(values.phone.trim())) {
      nextErrors.phone = "Please enter a valid phone number.";
    }
    if (!values.email.trim()) {
      nextErrors.email = "Please enter your e-mail address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid e-mail address.";
    }
    if (!values.vehicle) nextErrors.vehicle = "Please select a vehicle.";
    if (!values.pickupDate) {
      nextErrors.pickupDate = "Please select a pickup date.";
    } else if (values.pickupDate < today) {
      nextErrors.pickupDate = "Pickup date cannot be in the past.";
    }
    if (!values.message.trim()) nextErrors.message = "Please tell us how we can assist.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setSubmitted(true);
  };

  return (
    <div className="contact-page">
      <div className="contact-ambient" aria-hidden="true">
        <img src="/assets/f9cb5.svg" alt="" />
      </div>

      <section className="contact-hero" aria-labelledby="contact-title">
        <p>CONCIERGE</p>
        <h1 id="contact-title">Begin Your Journey</h1>
        <img src="/assets/6e9a8.svg" alt="" />
        <div>
          <p>Share your plans with us and our concierge team</p>
          <p>will arrange a vehicle worthy of the occasion,</p>
          <p>within the hour.</p>
        </div>
      </section>

      <section className="contact-details" aria-labelledby="reach-us-title">
        <h2 id="reach-us-title">Visit &amp; Reach Us</h2>
        <img className="contact-details-first-rule" src="/assets/27ab7.svg" alt="" />
        <div className="contact-detail-row showroom">
          <h3>SHOWROOM</h3>
          <a
            href="https://www.google.com/maps/search/?api=1&query=12+Parkstreet%2C+Kolkata%2C+West+Bengal+700016"
            target="_blank"
            rel="noreferrer"
            aria-label="Open the NOIR MOTORS showroom in Google Maps"
          >
            <span>12 Parkstreet</span>
            <span>Kolkata, West Bengal 700016</span>
          </a>
          <img src="/assets/f2835.svg" alt="" />
        </div>
        <div className="contact-detail-row telephone">
          <h3>TELEPHONE</h3>
          <a href="tel:+919876543210">+91 98765 43210</a>
          <img src="/assets/bf217.svg" alt="" />
        </div>
        <div className="contact-detail-row email">
          <h3>E-MAIL</h3>
          <a href="mailto:concierge@noirmotors.com">concierge@noirmotors.com</a>
          <img src="/assets/22705.svg" alt="" />
        </div>
        <div className="contact-detail-row hours">
          <h3>HOURS</h3>
          <p>
            <span>Monday - Sunday</span>
            <span>9:00 am - 9:00 pm</span>
          </p>
        </div>
      </section>

      <section className="contact-enquiry" aria-labelledby="enquiry-title">
        <h2 id="enquiry-title">Enquiry</h2>
        <form onSubmit={submitEnquiry} noValidate>
          <ContactField label="FULL NAME" error={errors.fullName} lineAsset="/assets/7b741.svg">
            <input
              type="text"
              autoComplete="name"
              value={values.fullName}
              onChange={(event) => updateField("fullName", event.target.value)}
              aria-invalid={Boolean(errors.fullName)}
              required
            />
          </ContactField>

          <ContactField label="PHONE" error={errors.phone} lineAsset="/assets/7186a.svg">
            <input
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={values.phone}
              onChange={(event) => updateField("phone", event.target.value)}
              aria-invalid={Boolean(errors.phone)}
              required
            />
          </ContactField>

          <ContactField label="E-MAIL" error={errors.email} lineAsset="/assets/fcadf.svg">
            <input
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={(event) => updateField("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              required
            />
          </ContactField>

          <ContactField label="VEHICLE" error={errors.vehicle} lineAsset="/assets/fcadf.svg">
            <select
              value={values.vehicle}
              onChange={(event) => updateField("vehicle", event.target.value)}
              aria-invalid={Boolean(errors.vehicle)}
              required
            >
              <option value="">Select a vehicle</option>
              {collectionCars.map((car) => (
                <option value={car.name} key={car.name}>
                  {car.name}
                </option>
              ))}
            </select>
          </ContactField>

          <ContactField label="PICKUP DATE" error={errors.pickupDate} lineAsset="/assets/7b741.svg">
            <input
              type="date"
              min={today}
              value={values.pickupDate}
              onChange={(event) => updateField("pickupDate", event.target.value)}
              aria-invalid={Boolean(errors.pickupDate)}
              required
            />
          </ContactField>

          <ContactField
            label="MESSAGE"
            error={errors.message}
            lineAsset="/assets/7b741.svg"
            message
          >
            <textarea
              value={values.message}
              onChange={(event) => updateField("message", event.target.value)}
              aria-invalid={Boolean(errors.message)}
              required
            />
          </ContactField>

          <button type="submit" disabled={submitted}>
            {submitted ? "ENQUIRY READY" : "SEND ENQUIRY"}
          </button>
          {submitted && (
            <p className="contact-confirmation" role="status">
              Thank you. Your enquiry details are complete in this frontend demonstration. Connect a
              secure form endpoint or CRM to transmit real submissions to NOIR MOTORS.
            </p>
          )}
        </form>
      </section>

      <footer className="contact-footer">
        <img src="/assets/27ab7.svg" alt="" />
        <div>
          <p>NOIR MOTORS</p>
          <p>© 2026</p>
        </div>
        <p>KOLKATA · BY APPOINTMENT</p>
      </footer>
    </div>
  );
}

function ContactField({
  label,
  error,
  lineAsset,
  message = false,
  children,
}: {
  label: string;
  error?: string;
  lineAsset: string;
  message?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`contact-field ${message ? "message" : ""}`}>
      <span>{label}</span>
      {children}
      <img src={lineAsset} alt="" />
      {error && <small>{error}</small>}
    </label>
  );
}

type FaqItem = {
  question: string;
  answer: string;
};

const faqGroups: { title: string; items: FaqItem[] }[] = [
  {
    title: "BOOKING",
    items: [
      {
        question: "How do I reserve a vehicle?",
        answer:
          "Browse the collection, choose your preferred vehicle and dates, then submit an availability request. Our concierge will contact you to confirm the details.",
      },
      {
        question: "How far in advance should I book?",
        answer:
          "We recommend booking as early as possible, especially for weekends and special occasions. Availability varies by vehicle and date.",
      },
      {
        question: "Can I cancel or modify my booking?",
        answer:
          "Yes. Contact our concierge as soon as possible to request a change or cancellation. Any adjustment remains subject to vehicle availability and the confirmed booking terms.",
      },
    ],
  },
  {
    title: "REQUIREMENTS",
    items: [
      {
        question: "What documents do I need?",
        answer:
          "A valid driving licence and government-issued identification are required. Our concierge will advise you if any additional verification is needed.",
      },
      {
        question: "What is the minimum age to rent?",
        answer:
          "Minimum age and driving-history requirements vary by vehicle. Our concierge will confirm the eligibility requirements for your chosen car.",
      },
      {
        question: "Is a security deposit required?",
        answer:
          "A refundable security deposit may be required depending on the vehicle and booking. The exact amount and release terms are confirmed before collection.",
      },
    ],
  },
  {
    title: "SERVICE",
    items: [
      {
        question: "Do you offer chauffeur-driven vehicles?",
        answer:
          "Yes. Chauffeur-driven services can be arranged on request for a comfortable and seamless travel experience.",
      },
      {
        question: "Can I request a specific vehicle delivery location?",
        answer:
          "Yes. We can arrange vehicle delivery and collection at your preferred location, subject to availability and prior confirmation.",
      },
      {
        question: "What if I need assistance during my rental?",
        answer:
          "Our concierge team is available to assist you throughout your rental period. You can contact us for support whenever required.",
      },
    ],
  },
];

function FaqPage({ onContact }: { onContact: () => void }) {
  const [openItems, setOpenItems] = useState<Set<string>>(() => new Set());

  const toggleItem = (id: string) => {
    setOpenItems((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="faq-page">
      <div className="faq-ambient" aria-hidden="true">
        <img src="/assets/f9cb5.svg" alt="" />
      </div>

      <section className="faq-hero" aria-labelledby="faq-title">
        <p>CONCIERGE ANSWERS</p>
        <h1 id="faq-title">
          Frequently Asked
          <span>Questions</span>
        </h1>
        <img src="/assets/6e9a8.svg" alt="" />
        <div>
          <p>Everything you need to know before you take</p>
          <p>the keys. Can’t find your answer? Our concierge is</p>
          <p>always at your service.</p>
        </div>
      </section>

      <section className="faq-content" aria-label="Frequently asked questions">
        {faqGroups.map((group) => (
          <div className="faq-group" key={group.title}>
            <h2>{group.title}</h2>
            <div className="faq-list">
              {group.items.map((item, index) => {
                const id = `${group.title.toLowerCase()}-${index}`;
                const isOpen = openItems.has(id);
                return (
                  <article className={`faq-item ${isOpen ? "open" : ""}`} key={item.question}>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`${id}-answer`}
                      onClick={() => toggleItem(id)}
                    >
                      <span>{item.question}</span>
                      <i className="faq-symbol" aria-hidden="true" />
                    </button>
                    <div className="faq-answer" id={`${id}-answer`} role="region">
                      <p>{item.answer}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      <section className="faq-concierge">
        <h2>Do you have any other questions?</h2>
        <button type="button" onClick={onContact}>
          CONTACT CONCIERGE
        </button>
      </section>

      <footer className="faq-footer">
        <img src="/assets/27ab7.svg" alt="" />
        <div>
          <p>NOIR MOTORS</p>
          <p>© 2026</p>
        </div>
        <p>KOLKATA · BY APPOINTMENT</p>
      </footer>
    </div>
  );
}

function PlaceholderPage({
  page,
  onHome,
  onBook,
}: {
  page: Exclude<Page, "home" | "about" | "collections" | "contact">;
  onHome: () => void;
  onBook: () => void;
}) {
  const content = pageCopy[page];
  return (
    <section className="placeholder-page">
      <div className="placeholder-glow" />
      <div className="placeholder-content">
        <p className="eyebrow">{content.eyebrow}</p>
        <h1>{content.title}</h1>
        <p className="placeholder-copy">{content.copy}</p>
        <div className="placeholder-actions">
          <button className="cta cta-filled" onClick={onBook}>
            BOOK YOUR DRIVE
          </button>
          <button className="text-link" onClick={onHome}>
            RETURN HOME
          </button>
        </div>
      </div>
      <footer className="simple-footer">
        NOIR MOTORS <span>KOLKATA · BY APPOINTMENT</span>
      </footer>
    </section>
  );
}

function DialogPanel({
  type,
  submitted,
  onClose,
  onSubmit,
}: {
  type: Exclude<Dialog, null>;
  submitted: boolean;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const title =
    type === "booking" ? "Book your drive" : type === "login" ? "Welcome back" : "Join Noir Motors";
  const eyebrow =
    type === "booking"
      ? "PRIVATE APPOINTMENT"
      : type === "login"
        ? "CLIENT ACCESS"
        : "CREATE AN ACCOUNT";

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <div className="dialog-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className="dialog-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        {!submitted ? (
          <>
            <p className="dialog-eyebrow">{eyebrow}</p>
            <h2 id="dialog-title">{title}</h2>
            <form onSubmit={submit}>
              {type === "booking" && (
                <>
                  <label>
                    Select a car
                    <select required defaultValue="">
                      <option value="" disabled>
                        Choose from the collection
                      </option>
                      <option>Aston Martin</option>
                      <option>Private collection consultation</option>
                    </select>
                  </label>
                  <div className="form-row">
                    <label>
                      Pickup date
                      <input type="date" required />
                    </label>
                    <label>
                      Return date
                      <input type="date" required />
                    </label>
                  </div>
                  <label>
                    Full name
                    <input type="text" autoComplete="name" required placeholder="Your name" />
                  </label>
                  <label>
                    Phone number
                    <input type="tel" autoComplete="tel" required placeholder="+91" />
                  </label>
                </>
              )}
              {type === "signup" && (
                <label>
                  Full name
                  <input type="text" autoComplete="name" required placeholder="Your name" />
                </label>
              )}
              {type !== "booking" && (
                <>
                  <label>
                    Email address
                    <input
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                    />
                  </label>
                  <label>
                    Password
                    <input
                      type="password"
                      autoComplete={type === "login" ? "current-password" : "new-password"}
                      required
                      placeholder="••••••••"
                    />
                  </label>
                </>
              )}
              <button className="dialog-submit" type="submit">
                {type === "booking"
                  ? "REQUEST APPOINTMENT"
                  : type === "login"
                    ? "LOG IN"
                    : "CREATE ACCOUNT"}
              </button>
            </form>
          </>
        ) : (
          <div className="confirmation">
            <p className="dialog-eyebrow">CONFIRMED</p>
            <h2 id="dialog-title">
              {type === "booking" ? "Your request is received." : "Thank you."}
            </h2>
            <p>
              {type === "booking"
                ? "Our concierge will contact you to arrange the details."
                : "Your details have been securely submitted."}
            </p>
            <button className="dialog-submit" onClick={onClose}>
              CLOSE
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
