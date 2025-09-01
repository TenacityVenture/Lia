import Image from "next/image"

export function LogosBar() {
  const companies = [
    { name: "Microsoft", logo: "/microsoft-logo.png" },
    { name: "Google", logo: "/google-logo.png" },
    { name: "Amazon", logo: "/amazon-logo.png" },
    { name: "Meta", logo: "/meta-logo-abstract.png" },
    { name: "LinkedIn", logo: "/linkedin-logo.png" },
    { name: "Salesforce", logo: "/salesforce-logo.png" },
  ]

  return (
    <section className="bg-muted/20 py-16">
      <div className="container">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">
            Trusted by professionals from
          </p>
          <h3 className="text-2xl font-bold text-foreground">Leading Companies Worldwide</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
          {companies.map((company, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-4 rounded-lg bg-background/50 hover:bg-background transition-colors group"
            >
              <Image
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                width={120}
                height={40}
                className="opacity-60 group-hover:opacity-100 transition-opacity filter grayscale group-hover:grayscale-0"
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Join 10,000+ professionals who trust LIA for their LinkedIn success
          </p>
        </div>
      </div>
    </section>
  )
}