function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <img src="/cliniclogo3.png" alt="Vasavi Dental Care" className={className} />
  );
}

export default Logo;
export { Logo };