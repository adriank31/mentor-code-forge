import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, X, Crown, Shield, Zap, Users, HelpCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "@/components/ui/use-toast";

const faqItems = [
  {
    question: "How does billing work?",
    answer: "We use Stripe for secure billing. You'll be charged monthly or yearly based on your chosen plan. All subscriptions auto-renew until canceled."
  },
  {
    question: "Can I get a refund?",
    answer: "Sorry for the inconvenience but we don't offer refunds. Please contact our support if you have any problems."
  },
  {
    question: "Do you offer student discounts?",
    answer: "We offer 15% off the Pro plan for students with valid .edu emails. Contact our support to verify."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. You can cancel your subscription at any time from your account settings. You'll retain access until the end of your billing period."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express) and digital wallets through our secure Stripe integration."
  }
];

const features = [
  {
    name: "Access to Learning Paths",
    free: "2 paths (Foundations, Memory & Lifetimes)",
    pro: "All 5 paths + future releases"
  },
  {
    name: "Lab Exercises",
    free: "Basic beginner labs",
    pro: "All labs (35+ advanced scenarios)"
  },
  {
    name: "AI Explanations",
    free: "5 per month",
    pro: "Unlimited"
  },
  {
    name: "Fuzz Testing",
    free: false,
    pro: true
  },
  {
    name: "Community Badge",
    free: false,
    pro: "Priority badge"
  },
  {
    name: "Support",
    free: "Community forums",
    pro: "Priority support"
  }
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  const handleUpgrade = async () => {
    try {
      const priceId = isYearly ? "price_yearly" : "price_monthly";
      const interval = isYearly ? "year" : "month";
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId, interval }
      });

      if (error) throw error;
      
      if (data?.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast({ 
        title: "Checkout failed", 
        description: message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-12 md:px-6 lg:pt-24">
        <div className="absolute inset-0 bg-gradient-surface opacity-30"></div>
        <div className="relative max-w-4xl mx-auto text-center">
          <Badge className="mb-6 px-4 py-1.5 bg-primary/10 text-primary border-primary/20">
            <Crown className="w-4 h-4 mr-2" />
            Test Mode
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Choose Your Plan
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Start Building Secure Systems
            </span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Get access to our complete C/C++ security learning platform. Start free, upgrade when you're ready.
          </p>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-4 mb-12">
            <span className={`font-medium ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`font-medium ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
              Yearly
            </span>
            <Badge variant="secondary" className="ml-2">
              Save 33%
            </Badge>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="border-border/50 bg-gradient-surface relative">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold">Free</CardTitle>
                <CardDescription className="text-base">
                  Perfect for getting started with secure C/C++
                </CardDescription>
                <div className="pt-4">
                  <div className="text-4xl font-bold">$0</div>
                  <div className="text-muted-foreground">forever</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Foundations & Memory paths</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Beginner security labs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>5 AI explanations/month</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Community forums</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span>Fuzz testing</span>
                  </li>
                  <li className="flex items-center gap-3 opacity-50">
                    <X className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    <span>Advanced labs</span>
                  </li>
                </ul>
                <Button className="w-full" variant="outline" size="lg">
                  Get Started Free
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-primary/50 bg-gradient-surface relative shadow-lg shadow-primary/10">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground px-4 py-1">
                  Most Popular
                </Badge>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
                  <Crown className="w-6 h-6 text-primary" />
                  Pro
                </CardTitle>
                <CardDescription className="text-base">
                  Full access to our secure systems curriculum
                </CardDescription>
                <div className="pt-4">
                  <div className="text-4xl font-bold">
                    ${isYearly ? '100' : '15'}
                  </div>
                  <div className="text-muted-foreground">
                    per {isYearly ? 'year' : 'month'}
                  </div>
                  {isYearly && (
                    <div className="text-sm text-primary font-medium">
                      $8.33/month when billed yearly
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>All 5 learning paths</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>35+ advanced security labs</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Unlimited AI explanations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Fuzz testing enabled</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Priority community badge</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <Button 
                  className="w-full" 
                  variant="hero" 
                  size="lg"
                  onClick={handleUpgrade}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-xl text-muted-foreground">
              See what's included in each plan
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-4 font-semibold">Feature</th>
                  <th className="text-center py-4 px-4 font-semibold">Free</th>
                  <th className="text-center py-4 px-4 font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr key={index} className="border-b border-border/50">
                    <td className="py-4 px-4 font-medium">{feature.name}</td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm">{feature.free}</span>
                      )}
                    </td>
                    <td className="text-center py-4 px-4">
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="w-5 h-5 text-primary mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-muted-foreground mx-auto" />
                        )
                      ) : (
                        <span className="text-sm font-medium">{feature.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about our pricing
            </p>
          </div>
          
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="border-border/50 bg-gradient-surface">
                <CardHeader>
                  <CardTitle className="text-lg flex items-start gap-3">
                    <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed pl-8">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security Note */}
      <section className="px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex items-center gap-4 p-6">
              <Shield className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg mb-1">Secure Checkout</h3>
                <p className="text-muted-foreground">
                  All payments are processed securely through Stripe. We never store your payment information.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}