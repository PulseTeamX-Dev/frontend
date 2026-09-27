interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return <section className="p-4">{children}</section>;
};

export default PageLayout;
