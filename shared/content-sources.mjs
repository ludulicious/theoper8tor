// Collection order matches the navigation. Numbering controls Studio order, not URLs.
export const pageSources = {
  home: { include: "00.index.md", prefix: "/" },
  speaker: { include: "01.speaker.md", prefix: "/" },
  services: { include: "02.services/00.index.md", prefix: "/" },
  offers: {
    include: "02.services/*.md",
    exclude: ["02.services/00.index.md"],
    prefix: "/book-online",
  },
  booking: { include: "03.booking/*.md", prefix: "/" },
  contact: { include: "04.contact.md", prefix: "/" },
  information: { include: "05.information/*.md", prefix: "/" },
  blogIndex: { include: "06.blog/00.index.md", prefix: "/" },
  blog: {
    include: "06.blog/*.md",
    exclude: ["06.blog/00.index.md"],
    prefix: "/blog/b",
  },
};
