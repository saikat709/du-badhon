const Page = async () => {

    return (
    <main className="min-h-screen bg-white dark:bg-dark-2 flex flex-col font-sans relative">
            {/* Animated Hero Section */}
            <section className="relative flex flex-col items-center justify-center py-24 bg-gray-1 dark:bg-dark-3 text-dark dark:text-white overflow-hidden">
                <img src="/images/logo/logo.png" alt="DU Badhon Logo" className="w-24 h-24 mb-4 z-10" />
                <h1 className="text-heading-2 font-bold mb-2 text-center z-10">DU Badhon</h1>
                <p className="text-body-2xlg mb-8 text-center max-w-xl text-dark-5 dark:text-dark-6 z-10">
                    Connecting blood donors and seekers across the community. Donate blood, save lives, or find donors in urgent need.
                </p>
                <div className="flex gap-4 z-10">
                    <a href="/search-blood" className="px-8 py-4 rounded-xl font-bold shadow-card bg-primary text-white text-lg hover:bg-primary/80 transition border-2 border-primary">Search Blood</a>
                    <a href="/blood-requests" className="px-8 py-4 rounded-xl font-bold shadow-card bg-white text-primary text-lg hover:bg-gray-2 transition border-2 border-primary">Request Blood</a>
                </div>
            </section>

            {/* Info Section with Icons */}
            <section className="py-16 px-4 max-w-4xl mx-auto text-center bg-white dark:bg-dark-2 rounded-xl shadow-card">
                <h2 className="text-heading-4 font-bold mb-4 text-primary dark:text-primary">Why DU Badhon?</h2>
                <p className="text-dark-5 mb-8 dark:text-dark-6">
                    Our platform makes it easy to find blood donors or request blood in emergencies. Join our growing network and make a difference today.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
                    <div className="bg-white dark:bg-dark-2 rounded-lg shadow-card p-8 flex flex-col items-center">
                        <span className="mb-3 text-primary text-4xl"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" fill="#F23030" /><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white">🔍</text></svg></span>
                        <h3 className="font-semibold text-primary mb-2">Fast Search</h3>
                        <p className="text-dark-6 dark:text-dark-6">Quickly locate donors by blood group and location.</p>
                    </div>
                    <div className="bg-white dark:bg-dark-2 rounded-lg shadow-card p-8 flex flex-col items-center">
                        <span className="mb-3 text-primary text-4xl"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" fill="#5750F1" /><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white">🔒</text></svg></span>
                        <h3 className="font-semibold text-primary mb-2">Secure & Private</h3>
                        <p className="text-dark-6 dark:text-dark-6">Your information is protected and only shared when needed.</p>
                    </div>
                    <div className="bg-white dark:bg-dark-2 rounded-lg shadow-card p-8 flex flex-col items-center">
                        <span className="mb-3 text-primary text-4xl"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" fill="#22AD5C" /><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white">🤝</text></svg></span>
                        <h3 className="font-semibold text-primary mb-2">Community Driven</h3>
                        <p className="text-dark-6 dark:text-dark-6">Join a trusted network of donors and volunteers.</p>
                    </div>
                </div>
            </section>

            {/* Steps Section with Icons */}
            <section className="py-12 px-4 bg-gray-1 dark:bg-dark-3 rounded-xl shadow-card mx-4">
                <h2 className="text-heading-5 font-bold text-center text-primary mb-8 dark:text-primary">How It Works</h2>
                <div className="flex flex-col md:flex-row justify-center gap-8 mt-8">
                    <div className="flex-1 bg-white dark:bg-dark-2 rounded-lg shadow-card p-8 flex flex-col items-center">
                        <span className="mb-3 text-primary text-4xl"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" fill="#5750F1" /><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white">📝</text></svg></span>
                        <h4 className="font-semibold mt-2 mb-1">Sign Up</h4>
                        <p className="text-dark-6 dark:text-dark-6">Create your account as a donor or seeker.</p>
                    </div>
                    <div className="flex-1 bg-white dark:bg-dark-2 rounded-lg shadow-card p-8 flex flex-col items-center">
                        <span className="mb-3 text-primary text-4xl"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" fill="#F23030" /><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white">🔎</text></svg></span>
                        <h4 className="font-semibold mt-2 mb-1">Search or Request</h4>
                        <p className="text-dark-6 dark:text-dark-6">Find donors or post a blood request easily.</p>
                    </div>
                    <div className="flex-1 bg-white dark:bg-dark-2 rounded-lg shadow-card p-8 flex flex-col items-center">
                        <span className="mb-3 text-primary text-4xl"><svg width="32" height="32" fill="currentColor"><circle cx="16" cy="16" r="16" fill="#22AD5C" /><text x="16" y="22" textAnchor="middle" fontSize="18" fill="white">❤️</text></svg></span>
                        <h4 className="font-semibold mt-2 mb-1">Connect & Donate</h4>
                        <p className="text-dark-6 dark:text-dark-6">Reach out, coordinate, and save lives together.</p>
                    </div>
                </div>
            </section>

            {/* Testimonial Carousel */}
            <section className="py-12 px-4 max-w-3xl mx-auto bg-white dark:bg-dark-2 rounded-xl shadow-card">
                <h2 className="text-heading-5 font-bold text-primary mb-6 text-center dark:text-primary">What People Say</h2>
                <div className="relative">
                    <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                        <div className="bg-white dark:bg-dark-2 rounded-lg shadow-card p-6 flex-1">
                            <p className="italic text-dark-6 dark:text-dark-6 mb-2">“I found a donor within minutes. DU Badhon truly saves lives!”</p>
                            <div className="flex items-center gap-2">
                                <img src="/images/user/user1.png" alt="User" className="w-8 h-8 rounded-full" />
                                <span className="font-semibold text-primary">Ayesha, Dhaka</span>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-dark-2 rounded-lg shadow-card p-6 flex-1">
                            <p className="italic text-dark-6 dark:text-dark-6 mb-2">“The platform is easy, secure, and community-driven.”</p>
                            <div className="flex items-center gap-2">
                                <img src="/images/user/user2.png" alt="User" className="w-8 h-8 rounded-full" />
                                <span className="font-semibold text-primary">Rahim, Chattogram</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Recent Requests Section */}
            <section className="py-12 px-4 max-w-4xl mx-auto bg-white dark:bg-dark-2 rounded-xl shadow-card">
                <h2 className="text-heading-5 font-bold text-primary mb-6 text-center dark:text-primary">Recent Blood Requests</h2>
                {/* Example static requests, replace with dynamic data if available */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-white dark:bg-dark-2 rounded-lg shadow-card p-4">
                        <h4 className="font-semibold text-primary">A+ Needed</h4>
                        <p className="text-dark-5 dark:text-dark-6">Location: Dhaka Medical College</p>
                        <p className="text-dark-6 text-sm dark:text-dark-6">Urgent • Posted 2 hours ago</p>
                    </div>
                    <div className="bg-white dark:bg-dark-2 rounded-lg shadow-card p-4">
                        <h4 className="font-semibold text-primary">O- Needed</h4>
                        <p className="text-dark-5 dark:text-dark-6">Location: BSMMU Hospital</p>
                        <p className="text-dark-6 text-sm dark:text-dark-6">Urgent • Posted 1 hour ago</p>
                    </div>
                </div>
                <div className="text-center mt-6">
                    <a href="/blood-requests" className="text-primary underline font-semibold dark:text-primary">View All Requests</a>
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-auto py-6 bg-gray-1 dark:bg-dark-3 text-dark-5 dark:text-dark-6 text-center border-t border-gray-3 dark:border-dark-3">
                <p className="mb-2">&copy; {new Date().getFullYear()} DU Badhon. All rights reserved.</p>
                <div className="flex justify-center gap-4">
                    <a href="mailto:contact@dubadhon.com" className="underline text-primary dark:text-primary">Contact</a>
                    <a href="https://facebook.com/dubadhon" target="_blank" rel="noopener" className="underline text-primary dark:text-primary">Facebook</a>
                </div>
            </footer>

            {/* Floating Help Button */}
            <a href="mailto:contact@dubadhon.com" className="fixed bottom-8 right-8 z-50 bg-primary text-white px-5 py-3 rounded-full shadow-lg font-semibold hover:bg-primary/80 transition flex items-center gap-2">
                <svg width="20" height="20" fill="currentColor" className="inline-block"><circle cx="10" cy="10" r="10" fill="#5750F1" /><text x="10" y="15" textAnchor="middle" fontSize="14" fill="#fff">?</text></svg>
                Need Help?
            </a>
        </main>
    );

}

export default Page;