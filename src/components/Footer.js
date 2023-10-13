const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-3">
      <p className="text-center">&copy; {currentYear} | All rights reserved</p>
    </footer>
  );
};

export default Footer;
