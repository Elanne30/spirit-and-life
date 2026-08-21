export type NavigationItem = {
  label: string;
  href?: string;
  children?: readonly NavigationItem[];
};

export const navigation = [
  { label: "Home", href: "/" },
  {
    label: "Messages",
    children: [
      { label: "Articles", href: "/articles" },
      { label: "Reflections", href: "/reflections" },
      { label: "Journals", href: "/journals" },
    ],
  },
  { label: "Books", href: "/books" },
  { label: "Podcast", href: "/podcast" },
  {
    label: "Library",
    children: [
      { label: "Topics", href: "/topics" },
      { label: "Series", href: "/series" },
      { label: "Questions", href: "/questions" },
      { label: "Resources", href: "/resources" },
    ],
  },
  { label: "Study Center", href: "/study-center" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const satisfies readonly NavigationItem[];
