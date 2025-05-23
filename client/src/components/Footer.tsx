const Footer = () => {
  return (
    <footer className="bg-white shadow-inner py-6 mt-16">
      <div className="container mx-auto text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} PDF Management & Collaboration System
      </div>
    </footer>
  );
};

export default Footer;
