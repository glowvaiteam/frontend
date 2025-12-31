import { Sparkles, User, Users, CheckCircle, XCircle, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import sardharImg from "../assets/sardhar.jpg";
import rahimathImg from "../assets/rahimath.jpg";
import wwiLogo from "../assets/wwi2.png";

export default function About() {
	return (
		<div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100">
			{/* Hero */}
			<section className="relative py-20 md:py-32 overflow-hidden">
				<div className="absolute inset-0 gradient-hero opacity-40 pointer-events-none" />
				<div className="container relative px-4 md:px-6">
					<div className="max-w-3xl mx-auto text-center">
						<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-100/60 border border-yellow-300 text-sm font-medium text-yellow-700 mb-6">
							
							About Glowvai
						</div>
						<h1 className="text-4xl md:text-5xl font-bold mb-6">
							Know Your Skin. Choose Smarter.{" "}
							<span className="text-gradient">GlowVAI</span>
						</h1>
						<p className="text-lg text-muted-foreground mb-2">
							Glowvai is a skin analysis and product recommendation platform built
							to help people understand their skin better and choose products that
							actually suit them — not what influencers push or ads manipulate.
						</p>
						<p className="text-base text-muted-foreground">
							This is our debut product, and it solves one clear problem:{" "}
							<span className="font-semibold text-yellow-700">
								most people don’t know their skin, but they keep buying products
								anyway.
							</span>
						</p>
					</div>
				</div>
			</section>

			{/* Why GlowVAI */}
			<section className="py-16 md:py-24">
				<div className="container px-4 md:px-6 max-w-4xl mx-auto">
					<div className="mb-10 text-center">
						<h2 className="text-3xl font-bold mb-4">Why GlowVAI Was Built</h2>
						<p className="text-muted-foreground mb-4">
							The skincare market is crowded, confusing, and biased. People
							experiment blindly, damage their skin, waste money, and lose trust.
							<br />
							<span className="font-semibold text-yellow-700">
								Glowvai exists to change that.
							</span>
						</p>
						<p className="text-muted-foreground">
							By combining AI-driven skin analysis with data-backed product
							recommendations, we aim to reduce guesswork and help users make
							informed skincare decisions based on their skin type, concerns, and
							conditions.
							<br />
							<span className="font-medium text-gray-800">
								No hype. No fake promises. Just smarter choices.
							</span>
						</p>
					</div>
				</div>
			</section>

			{/* Founders */}
			<section className="py-16 md:py-24 bg-secondary/30">
				<div className="container px-4 md:px-6 max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold mb-8 text-center">Founders</h2>
					<div className="grid md:grid-cols-2 gap-8">
						<Card className="p-6 flex flex-col items-center text-center">
							<div className="w-40 h-40 mb-4 rounded-lg overflow-hidden bg-yellow-200 flex items-center justify-center border border-gray-200 shadow-md">
								<img src={sardharImg} alt="SK Sardhar Musthafa" className="object-cover w-full h-full" />
							</div>
							<h3 className="text-xl font-semibold mb-1">
								SK Sardhar Musthafa
							</h3>
							<p className="text-sm text-yellow-700 font-medium mb-1">
								Founder – Glowvai
							</p>
							<p className="text-xs text-muted-foreground mb-2">
								Vijayawada, Andhra Pradesh
							</p>
							<p className="text-sm text-muted-foreground">
								I’m an 18-year-old B.Sc. AIML student with a deep interest in AI,
								systems, and business. GlowVAI started as an experiment to apply AI
								practically — not as a college project, but as a real product people
								can use.
								<br />
								<br />
								I’ve explored multiple fields including AI tools, prompt engineering,
								cybersecurity fundamentals, design, and digital systems. That
								cross-domain exposure helped shape GlowVAI as a product-focused
								platform, not a theory-heavy concept.
								<br />
								<br />
								GlowVAI is not built on claims of expertise — it’s built on learning
								Fast, testing honestly, and improving continuously.
							</p>
						</Card>
						<Card className="p-6 flex flex-col items-center text-center">
							<div className="w-40 h-40 mb-4 rounded-lg overflow-hidden bg-yellow-200 flex items-center justify-center border border-gray-200 shadow-md">
								<img src={rahimathImg} alt="SK Rahimath" className="object-cover w-full h-full" />
							</div>
							<h3 className="text-xl font-semibold mb-1">SK Rahimath</h3>
							<p className="text-sm text-yellow-700 font-medium mb-1">
								Co-Founder – Glowvai
							</p>
							<p className="text-xs text-muted-foreground mb-2"></p>
							<p className="text-sm text-muted-foreground">
								Rahimath represents real-world responsibility and consistency. At 23,
								he is a working professional who discontinued his degree due to
								financial responsibilities and now works in a reputed company as a
								Beauty Advisor.
								<br />
								<br />
								His direct experience with skincare products, customer concerns, and
								real user behavior brings practical insight into Glowvai's
								recommendations and user experience.
								<br />
								<br />
								Glowvai benefits from his understanding of what customers actually
								ask for — not what trends suggest.
							</p>
						</Card>
					</div>
				</div>
			</section>

			{/* Technology & Development */}
			<section className="py-16 md:py-24">
				<div className="container px-4 md:px-6 max-w-4xl mx-auto">
					<h2 className="text-3xl font-bold mb-8 text-center">
						Our Official Partner 
					</h2>
					{/* Our Tech Partner Logo */}
					<div className="flex flex-col items-center mb-6">
						<a href="https://wwi.org.in" target="_blank" rel="noopener noreferrer">
							<img src={wwiLogo} alt="Work Wizards Innovations Logo" className="h-56 w-auto mb-2 cursor-pointer" />
						</a>
						<h1 className="font-bold text-yellow-700 mt-2 text-xl">Our Tech Partner</h1>
					</div>
					<Card className="p-6 mb-8">
						<p className="text-muted-foreground mb-2">
							Glowvai's platform is developed in collaboration with{" "}
							<a
			href="https://wwi.org.in"
			target="_blank"
			rel="noopener noreferrer"
			className="font-semibold text-yellow-700 hover:underline"
		>
			Work Wizards Innovations
		</a>
		, a young and skilled technical team focused on building scalable
		digital products.
						</p>
						<ul className="list-disc pl-6 text-muted-foreground mb-2">
							<li>Web platform development</li>
							<li>AI & ML model implementation</li>
							<li>UI/UX and performance optimization</li>
							<li>Data handling and system design</li>
						</ul>
						<div className="flex flex-col sm:flex-row gap-4 mt-4">
		<div className="flex-1">
			<p className="text-sm text-muted-foreground" style={{ maxWidth: "420px" }}>
				Despite being early in their academic journey, their practical execution and startup mindset made them the right fit to build Glowvai’s first version.
			</p>
			<div className="mt-6 flex flex-col items-end">
		<span className="block text-xs text-gray-500">Founder  and  CEO</span>
		<span className="block text-base font-semibold text-yellow-800 italic border-t border-gray-200 pt-2" style={{ maxWidth: "200px" }}>
			Nalla Venkat
		</span>
	</div>
		</div>
	</div>
					</Card>
				</div>
			</section>

			{/* What GlowVAI Is / Is Not */}
			<section className="py-16 md:py-24 bg-secondary/30">
	<div className="container px-4 md:px-6 max-w-4xl mx-auto">
		<h2 className="text-3xl font-bold mb-8 text-center">
			What GlowVAI Is — and Is Not
		</h2>
		<div className="grid md:grid-cols-2 gap-8">
			{/* Glowvai is: */}
			<Card className="p-6 flex flex-col items-start">
				<h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-700">
					<CheckCircle className="w-5 h-5" /> Glowvai is:
				</h3>
				<ul className="list-disc pl-6 text-muted-foreground space-y-2">
					<li>A skin analysis & recommendation platform</li>
					<li>Data-driven, not influencer-driven</li>
					<li>Built for clarity, not confusion</li>
				</ul>
			</Card>
			{/* Glowvai is not: */}
			<Card className="p-6 flex flex-col items-start">
				<h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-red-700">
					<XCircle className="w-5 h-5" /> Glowvai is not:
				</h3>
				<ul className="list-disc pl-6 text-muted-foreground space-y-2">
					<li>A skincare brand</li>
					<li>A cosmetic seller</li>
					<li>A generic tech services company</li>
				</ul>
			</Card>
		</div>
	</div>
</section>

			{/* Vision */}
			<section className="py-16 md:py-24">
				<div className="container px-4 md:px-6 max-w-3xl mx-auto">
					<div className="text-center">
						<h2 className="text-3xl font-bold mb-4">Our Vision</h2>
						<Lightbulb className="w-10 h-10 mx-auto mb-4 text-yellow-400" />
						<p className="text-lg text-muted-foreground mb-2">
							GlowVAI aims to become a trusted decision layer between users and
							skincare products — helping people understand before they buy.
						</p>
						<p className="text-base text-muted-foreground">
							This is just the beginning.
						</p>
					</div>
				</div>
			</section>
		</div>
	);
}
