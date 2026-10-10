// Collection order matches the navigation. Numbering controls Studio order, not URLs.
export const pageSources = {
  content: { include: "pages/*.md", prefix: "/" },
  offers: {
    include: "02.services/*.md",
    prefix: "/book-a-session",
  },
  booking: { include: "03.booking/**/*.md", prefix: "/book-a-session" },
  information: { include: "05.information/**/*.md", prefix: "/" },
  blogIndex: { include: "06.blog/00.index.md", prefix: "/" },
  blog: {
    include: "06.blog/*.md",
    exclude: ["06.blog/00.index.md"],
    prefix: "/blog",
  },
};
