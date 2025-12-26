"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Copy, Link, Check } from "lucide-react"
import { createUpgradePaymentLink, formatCurrency } from "@/lib/payments"
import { useToast } from "@/hooks/use-toast"

interface UpgradeLinkGeneratorProps {
  orderId: string
  customerEmail: string
}

export function UpgradeLinkGenerator({ orderId, customerEmail }: UpgradeLinkGeneratorProps) {
  const [selectedUpgrades, setSelectedUpgrades] = useState({
    storySize: false,
    makeDifferent: false,
    animated: false,
    expressDelivery: false,
  })
  const [generatedLink, setGeneratedLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  const upgradeOptions = [
    { id: "storySize", name: "Story Size Version", price: 10 },
    { id: "makeDifferent", name: "Make Different/Custom", price: 10 },
    { id: "animated", name: "Animated Flyer", price: 25 },
    { id: "expressDelivery", name: "Express Delivery (1 hour)", price: 20 },
  ]

  const calculateUpgradeTotal = () => {
    return upgradeOptions.reduce((total, option) => {
      return total + (selectedUpgrades[option.id as keyof typeof selectedUpgrades] ? option.price : 0)
    }, 0)
  }

  const handleGenerateLink = async () => {
    const total = calculateUpgradeTotal()
    if (total === 0) {
      toast({
        title: "No upgrades selected",
        description: "Please select at least one upgrade option",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const link = await createUpgradePaymentLink(orderId, total)
      setGeneratedLink(link)
      toast({
        title: "Upgrade link generated",
        description: "You can now share this link with the customer",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate upgrade link",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(generatedLink)
      setIsCopied(true)
      toast({
        title: "Link copied",
        description: "Upgrade link copied to clipboard",
      })
      setTimeout(() => setIsCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy link",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-card-foreground">Generate Upgrade Payment Link</CardTitle>
        <p className="text-sm text-muted-foreground">
          Create a payment link for additional services for Order #{orderId}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Customer Info */}
        <div className="p-3 bg-muted/20 rounded-lg">
          <p className="text-sm text-muted-foreground">Customer Email</p>
          <p className="font-medium text-card-foreground">{customerEmail}</p>
        </div>

        {/* Upgrade Options */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Available Upgrades</Label>
          {upgradeOptions.map((option) => (
            <div key={option.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={option.id}
                  checked={selectedUpgrades[option.id as keyof typeof selectedUpgrades]}
                  onCheckedChange={(checked) =>
                    setSelectedUpgrades({
                      ...selectedUpgrades,
                      [option.id]: !!checked,
                    })
                  }
                />
                <Label htmlFor={option.id} className="cursor-pointer">
                  {option.name}
                </Label>
              </div>
              <Badge variant="outline">{formatCurrency(option.price)}</Badge>
            </div>
          ))}
        </div>

        {/* Total */}
        {calculateUpgradeTotal() > 0 && (
          <div className="flex justify-between items-center p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <span className="font-medium text-card-foreground">Total Upgrade Cost</span>
            <span className="text-lg font-bold text-primary">{formatCurrency(calculateUpgradeTotal())}</span>
          </div>
        )}

        {/* Generate Link */}
        <Button
          onClick={handleGenerateLink}
          disabled={isGenerating || calculateUpgradeTotal() === 0}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              Generating...
            </>
          ) : (
            <>
              <Link className="w-4 h-4 mr-2" />
              Generate Payment Link
            </>
          )}
        </Button>

        {/* Generated Link */}
        {generatedLink && (
          <div className="space-y-3">
            <Label>Generated Payment Link</Label>
            <div className="flex gap-2">
              <Input value={generatedLink} readOnly className="bg-muted border-border" />
              <Button variant="outline" size="icon" onClick={handleCopyLink} className="bg-transparent">
                {isCopied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Share this link with the customer to allow them to pay for additional services.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
