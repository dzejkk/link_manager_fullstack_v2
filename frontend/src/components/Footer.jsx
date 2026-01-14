export default function Footer() {
  const date = new Date().toLocaleDateString("de-DE").slice(4);

  return (
    <h2
      style={{
        textAlign: "center",
        margin: "8px",
        fontSize: "12px",
        color: "gray",
        marginTop: "auto",
        fontWeight: "400",
      }}
    >
      <p> © {date} Developed by Jakub Kontra </p>
    </h2>
  );
}
