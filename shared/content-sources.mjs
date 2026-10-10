// Collection order matches the navigation. Numbering controls Studio order, not URLs.
export const pageSources = {
  home: { include: "00.index.md", prefix: "/" },
  speaker: { include: "01.speaking.md", prefix: "/" },
  services: { include: "02.how-can-help.md", prefix: "/" },
  offers: {
    include: "02.services/*.md",
    prefix: "/book-a-session",
  },
  booking: { include: "03.booking/**/*.md", prefix: "/book-a-session" },
  contact: { include: "04.contact.md", prefix: "/" },
  information: { include: "05.information/**/*.md", prefix: "/" },
  blogIndex: { include: "06.blog/00.index.md", prefix: "/" },
  blog: {
    include: "06.blog/*.md",
    exclude: ["06.blog/00.index.md"],
    prefix: "/blog",
  },
};
