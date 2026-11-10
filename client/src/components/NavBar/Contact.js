import React from "react";
const Contact = () => (
  <main className="conTact electrical-contact-page">
    <section className="containerContact">
      <div className="electrical-contact-symbol" aria-hidden="true">⚡</div>
      <div className="descriptionContact">
        <span className="dashboard-kicker">AN PHÁT ĐIỆN MÁY</span>
        <h2>Tư vấn đúng thiết bị – an tâm sử dụng</h2>
        <p>Chúng tôi cung cấp máy bơm nước, thiết bị điện và vật dụng điện dân dụng. Hãy liên hệ để được hỗ trợ lựa chọn sản phẩm phù hợp với công suất, mục đích sử dụng và ngân sách.</p>
        <p><strong>Danh mục tư vấn:</strong> máy bơm gia đình và công trình, dây cáp điện, thiết bị đóng cắt, đèn chiếu sáng và phụ kiện điện nước.</p>
      </div>
    </section>
  </main>
);
export default Contact;

.electrical-contact-page .containerContact{max-width:1120px;margin:3rem auto;display:grid;grid-template-columns:.8fr 1.2fr;align-items:center;padding:1rem;gap:2rem}.electrical-contact-symbol{min-height:300px;display:grid;place-items:center;border-radius:24px;background:linear-gradient(145deg,#075b91,#082f4c);color:#ffb84a;font-size:clamp(90px,15vw,170px);box-shadow:var(--pet-shadow)}.electrical-contact-page .descriptionContact{width:100%;padding:clamp(1.4rem,4vw,3rem)}.electrical-contact-page .descriptionContact h2{font-size:clamp(1.8rem,4vw,2.8rem);font-weight:800}.electrical-contact-page .descriptionContact p{color:#657789;line-height:1.8}@media(max-width:700px){.electrical-contact-page .containerContact{grid-template-columns:1fr;margin:1rem auto;padding:.4rem;gap:1rem}.electrical-contact-symbol{min-height:180px;font-size:90px}.electrical-contact-page .descriptionContact{padding:1.2rem}}
