import React from 'react';
import { FiUsers, FiTarget, FiBarChart2, FiCheck, FiArrowRight } from 'react-icons/fi';

function App() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 gradient-bg rounded-lg"></div>
              <span className="ml-2 text-xl font-bold text-gray-900">FocusLab</span>
            </div>
            <div className="hidden md:flex space-x-4">
              <a href="#features" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                How It Works
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 px-3 py-2">
                Pricing
              </a>
            </div>
            <div className="hidden md:flex space-x-2">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900">
                Sign In
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Get Started
              </button>
            </div>
            <div className="md:hidden">
              <button className="text-gray-600 hover:text-gray-900">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary-50 to-secondary-50">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Get Premium Feedback With Virtual Focus Groups
              </h1>
              <p className="mt-6 text-xl text-gray-600">
                Connect with your ideal audience and gather actionable insights through AI-powered virtual focus groups.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
                <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-lg">
                  Get Started Free
                </button>
                <button className="px-6 py-3 bg-white text-primary-600 rounded-lg border border-primary-600 hover:bg-primary-50">
                  Learn How It Works
                </button>
              </div>
            </div>
            <div className="mt-10 md:mt-0 md:w-1/2">
              <div className="relative mx-auto w-full max-w-md">
                <div className="aspect-w-4 aspect-h-3">
                  <div className="w-full h-full bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="p-4 bg-primary-600 text-white">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Focus Group Dashboard</h3>
                        <div className="flex space-x-1">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div className="h-2 bg-gray-200 rounded-full w-3/4"></div>
                        <div className="h-2 bg-gray-200 rounded-full"></div>
                        <div className="h-2 bg-gray-200 rounded-full w-5/6"></div>
                      </div>
                      <div className="mt-6 grid grid-cols-2 gap-4">
                        <div className="h-20 bg-gray-100 rounded-lg"></div>
                        <div className="h-20 bg-gray-100 rounded-lg"></div>
                        <div className="h-20 bg-gray-100 rounded-lg"></div>
                        <div className="h-20 bg-gray-100 rounded-lg"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-100 rounded-full z-[-1]"></div>
                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary-100 rounded-full z-[-1]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose FocusLab?</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform makes it easy to connect with your target audience and get valuable feedback.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <FiTarget className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Matching</h3>
              <p className="text-gray-600">
                Our smart algorithms connect your content with the perfect audience for targeted, relevant feedback.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <FiUsers className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Participants</h3>
              <p className="text-gray-600">
                Access verified participants across all demographics and interests for diverse perspectives.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <FiBarChart2 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-time Analytics</h3>
              <p className="text-gray-600">
                Get instant insights with comprehensive analytics and reports to inform your decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with FocusLab in just a few simple steps
            </p>
          </div>

          <div className="mt-16 relative">
            {/* Connection line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
            
            <div className="grid gap-8 md:grid-cols-4 relative z-10">
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Create Account</h3>
                <p className="text-gray-600 text-center">
                  Sign up and set up your organization profile in minutes.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Define Your Audience</h3>
                <p className="text-gray-600 text-center">
                  Specify demographic and psychographic criteria for your focus group.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Launch Session</h3>
                <p className="text-gray-600 text-center">
                  Start your virtual focus group with matched participants.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center mb-4 mx-auto">
                  4
                </div>
                <h3 className="text-xl font-semibold mb-2 text-center">Get Insights</h3>
                <p className="text-gray-600 text-center">
                  Review detailed analytics and actionable feedback reports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">What Our Clients Say</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Hear from businesses that have transformed their research with FocusLab
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Sarah Johnson</h4>
                  <p className="text-gray-600">Marketing Director, TechCorp</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "FocusLab transformed our product validation process. We got actionable insights in days instead of weeks."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Michael Chen</h4>
                  <p className="text-gray-600">Product Manager, InnovateCo</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "The quality of participants and depth of feedback we received through FocusLab exceeded our expectations."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">Emily Rodriguez</h4>
                  <p className="text-gray-600">CEO, StartupX</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "FocusLab helped us pivot our product direction based on real customer feedback. Worth every penny."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Simple, Transparent Pricing</h2>
            <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that works best for your research needs
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Starter Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
              <p className="mt-4 text-gray-600">Perfect for small teams and startups</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$299</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-6 space-y-4">
                {['Up to 3 focus groups per month', '10 participants per group', 'Basic analytics', 'Email support'].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Get Started
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-white p-8 rounded-xl shadow-xl border-2 border-primary-500 relative transform md:-translate-y-4">
              <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Professional</h3>
              <p className="mt-4 text-gray-600">For growing businesses and agencies</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">$699</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-6 space-y-4">
                {['Up to 10 focus groups per month', '20 participants per group', 'Advanced analytics & reporting', 'Priority email & chat support', 'Custom screening questions'].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                Get Started
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
              <p className="mt-4 text-gray-600">For large organizations with custom needs</p>
              <div className="mt-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="mt-6 space-y-4">
                {['Unlimited focus groups', 'Unlimited participants', 'Custom analytics & integrations', 'Dedicated account manager', 'Phone, email & chat support', 'Custom participant sourcing'].map((feature) => (
                  <li key={feature} className="flex items-center">
                    <FiCheck className="w-5 h-5 text-green-500 mr-2" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full py-3 border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to transform your market research?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of businesses getting actionable insights with FocusLab.
          </p>
          <button className="px-8 py-4 bg-white text-primary-600 rounded-lg hover:bg-gray-100 shadow-lg font-semibold flex items-center mx-auto">
            Get Started Free
            <FiArrowRight className="ml-2" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 md:grid-cols-4">
            {/* Company Info */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 gradient-bg rounded-lg"></div>
                <span className="ml-2 text-xl font-bold">FocusLab</span>
              </div>
              <p className="text-gray-400 mb-4">
                Premium virtual focus group platform for market research and product feedback.
              </p>
              <div className="flex space-x-4">
                {['twitter', 'facebook', 'instagram', 'linkedin'].map((social) => (
                  <a key={social} href="#" className="text-gray-400 hover:text-white">
                    <span className="sr-only">{social}</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Features', 'How It Works', 'Pricing', 'About Us'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                {['Blog', 'Case Studies', 'Help Center', 'API Documentation'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-400 hover:text-white">{link}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>support@focuslab.com</li>
                <li>+1 (555) 123-4567</li>
                <li>San Francisco, CA</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 FocusLab. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((policy) => (
                <a key={policy} href="#" className="text-gray-400 hover:text-white text-sm">
                  {policy}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;