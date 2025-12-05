import React, { useState } from 'react'
import Footer from '../components/landing/Footer';

const Reviews = () => {

  const faqs = [
    {
      question: "What types of events do you manage?",
      answer:
        "We handle weddings, corporate events, birthday parties, college fests, social gatherings, product launches, and many more customized events.",
    },
    {
      question: "Do you organize events in multiple cities?",
      answer:
        "Yes! We operate across major cities including Bangalore, Mumbai, Hyderabad, Chennai, Pune, Gurgaon, Jaipur, Ahmedabad, and more.",
    },
    {
      question: "How early should I book my event?",
      answer:
        "We recommend booking at least 2–4 weeks beforehand to ensure availability and smooth planning. However, we also handle last-minute event requests.",
    },
    {
      question: "Do you provide decoration, photography, and catering?",
      answer:
        "Yes, we have an expert network of decorators, photographers, entertainers, and caterers who deliver complete event experiences.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <section className="w-full bg-white max-w-7xl mx-auto py-8 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Reviews */}
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-600 text-center mb-12">
            What People Say
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Aarav Sharma",
                review:
                  "Amazing experience! The team handled everything perfectly. Hassle-free, beautiful decoration & very professional.",
              },
              {
                name: "Ishita Verma",
                review:
                  "Loved the management and coordination. They made our event memorable and absolutely stress-free!",
              },
              {
                name: "Rahul Mehta",
                review:
                  "Very professional and creative team. Timely updates, smooth execution, and great support throughout.",
              },
            ].map((rev, i) => (
              <div
                key={i}
                className="p-6 bg-white border hover:shadow-sm transition"
              >
                <p className="text-gray-700 leading-relaxed">“{rev.review}”</p>
                <h4 className="mt-4 text-lg font-semibold text-gray-900">
                  — {rev.name}
                </h4>
              </div>
            ))}
          </div>

          {/* FAQs */}
          <h2 className="text-4xl md:text-5xl font-semibold text-gray-600 text-center mt-20 mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6 max-w-3xl mx-auto">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border p-5 cursor-pointer transition hover:shadow-sm"
                onClick={() => toggleFAQ(idx)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {faq.question}
                  </h3>
                  <span className="text-xl text-gray-600">
                    {openIndex === idx ? "−" : "+"}
                  </span>
                </div>

                {openIndex === idx && (
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

export default Reviews