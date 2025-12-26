// // "use client"

// // import type React from "react"
// // import { useState } from "react"
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogHeader,
// //   DialogTitle,
// // } from "@/components/ui/dialog"
// // import { Button } from "@/components/ui/button"
// // import { Input } from "@/components/ui/input"
// // import { Label } from "@/components/ui/label"
// // import { Separator } from "@/components/ui/separator"
// // import { useAuth } from "@/lib/auth"
// // import { Eye, EyeOff, Mail, Lock, User, Chrome, Apple } from "lucide-react"
// // import { useToast } from "@/hooks/use-toast"

// // // ⚡ Import Shadcn OTP components
// // import {
// //   InputOTP,
// //   InputOTPGroup,
// //   InputOTPSlot,
// // } from "@/components/ui/input-otp"

// // interface AuthModalProps {
// //   isOpen: boolean
// //   onClose: () => void
// //   defaultMode?: string
// // }

// // // 🔹 Simple OTP generator
// // function generateOTP(length = 6) {
// //   let otp = ""
// //   for (let i = 0; i < length; i++) {
// //     otp += Math.floor(Math.random() * 10)
// //   }
// //   return otp
// // }

// // export function AuthModal({
// //   isOpen,
// //   onClose,
// //   defaultMode = "signin",
// // }: AuthModalProps) {
// //   const [mode, setMode] = useState(defaultMode)
// //   const [showPassword, setShowPassword] = useState(false)
// //   const [formData, setFormData] = useState({
// //     email: "",
// //     password: "",
// //     name: "",
// //     otp: "",
// //   })
// //   const [isLoading, setIsLoading] = useState(false)
// //   const [generatedOTP, setGeneratedOTP] = useState("")

// //   const { signIn, signUp, signInWithGoogle, signInWithApple } = useAuth()
// //   const { toast } = useToast()

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     setIsLoading(true)

// //     try {
// //       // 🔹 Sign In → generate OTP first
// //       if (mode === "signin") {
// //         if (!formData.email) {
// //           toast({
// //             title: "Email required",
// //             description: "Please enter your email before signing in.",
// //             variant: "destructive",
// //           })
// //           setIsLoading(false)
// //           return
// //         }

// //         // simulate sending OTP
// //         const otp = generateOTP()
// //         setGeneratedOTP(otp)
// //         console.log("Generated OTP:", otp)

// //         toast({
// //           title: "OTP Sent",
// //           description: `A verification code has been sent to ${formData.email}`,
// //         })

// //         setMode("otp") // show OTP screen
// //         setIsLoading(false)
// //         return
// //       }

// //       // 🔹 OTP Verification
// //       if (mode === "otp") {

// //           await signIn(formData.email, formData.password)
// //           toast({
// //             title: "Welcome back!",
// //             description: "You have successfully signed in.",
// //           })
// //           onClose()
// //         setIsLoading(false)
// //         return
// //       }

// //       // 🔹 Sign Up
// //       if (mode === "signup") {
// //         await signUp(formData.email, formData.password, formData.name)
// //         toast({
// //           title: "Account created!",
// //           description: "Please check your email for verification.",
// //         })
// //         setMode("otp")
// //       }
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description:
// //           error instanceof Error ? error.message : "Something went wrong",
// //         variant: "destructive",
// //       })
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleSocialSignIn = async (provider: "google" | "apple") => {
// //     setIsLoading(true)
// //     try {
// //       if (provider === "google") {
// //         await signInWithGoogle()
// //       } else {
// //         await signInWithApple()
// //       }
// //       toast({
// //         title: "Welcome!",
// //         description: `Successfully signed in with ${provider}.`,
// //       })
// //       onClose()
// //     } catch (error) {
// //       toast({
// //         title: "Error",
// //         description:
// //           error instanceof Error
// //             ? error.message
// //             : "Social sign-in failed",
// //         variant: "destructive",
// //       })
// //     } finally {
// //       setIsLoading(false)
// //     }
// //   }

// //   const handleResendOTP = () => {
// //     const otp = generateOTP()
// //     setGeneratedOTP(otp)
// //     console.log("Resent OTP:", otp)
// //     toast({
// //       title: "OTP Resent",
// //       description: `A new code has been sent to ${formData.email}`,
// //     })
// //   }

// //   return (
// //     <Dialog open={isOpen} onOpenChange={onClose}>
// //       <DialogContent className="sm:max-w-md bg-card border-border">
// //         <DialogHeader>
// //           <DialogTitle className="text-center text-card-foreground">
// //             {mode === "signin" && "Sign In to Grodify"}
// //             {mode === "signup" && "Create Your Account"}
// //             {mode === "otp" && "Verify Your Email"}
// //           </DialogTitle>
// //         </DialogHeader>

// //         <div className="space-y-6">
// //           {/* 🔹 OTP Screen */}
// //           {mode === "otp" ? (
// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               <p className="text-center text-sm text-muted-foreground">
// //                 Enter the 6-digit code sent to <b>{formData.email}</b>
// //               </p>

// //               <div className="flex justify-center">
// //                 <InputOTP
// //                   maxLength={6}
// //                   value={formData.otp}
// //                   onChange={(value) =>
// //                     setFormData({ ...formData, otp: value })
// //                   }
// //                 >
// //                   <InputOTPGroup>
// //                     {[...Array(6)].map((_, i) => (
// //                       <InputOTPSlot key={i} index={i} />
// //                     ))}
// //                   </InputOTPGroup>
// //                 </InputOTP>
// //               </div>

// //               <div className="flex justify-center">
// //                 <Button
// //                   type="button"
// //                   variant="ghost"
// //                   onClick={handleResendOTP}
// //                 >
// //                   Resend OTP
// //                 </Button>
// //               </div>

// //               <Button
// //                 type="submit"
// //                 className="w-full"
// //                 disabled={formData.otp.length < 6 || isLoading}
// //               >
// //                 {isLoading ? "Verifying..." : "Verify & Sign In"}
// //               </Button>
// //             </form>
// //           ) : (
// //             <>
// //               {/* 🔹 Social Sign In */}
// //               <div className="space-y-3">
// //                 <Button
// //                   variant="outline"
// //                   className="w-full bg-transparent hover:!bg-primary hover:!text-white"
// //                   onClick={() => handleSocialSignIn("google")}
// //                   disabled={isLoading}
// //                 >
// //                   <Chrome className="w-4 h-4 mr-2" />
// //                   Continue with Google
// //                 </Button>
// //                 <Button
// //                   variant="outline"
// //                   className="w-full bg-transparent hover:!bg-primary hover:!text-white"
// //                   onClick={() => handleSocialSignIn("apple")}
// //                   disabled={isLoading}
// //                 >
// //                   <Apple className="w-4 h-4 mr-2" />
// //                   Continue with Apple
// //                 </Button>
// //               </div>

// //               <div className="relative">
// //                 <div className="absolute inset-0 flex items-center">
// //                   <Separator className="w-full" />
// //                 </div>
// //                 <div className="relative flex justify-center text-xs uppercase">
// //                   <span className="bg-card px-2 text-muted-foreground">
// //                     Or continue with email
// //                   </span>
// //                 </div>
// //               </div>

// //               {/* 🔹 Email/Password Form */}
// //               <form onSubmit={handleSubmit} className="space-y-4">
// //                 {mode === "signup" && (
// //                   <div className="space-y-2">
// //                     <Label htmlFor="name">Full Name</Label>
// //                     <div className="relative">
// //                       <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
// //                       <Input
// //                         id="name"
// //                         type="text"
// //                         placeholder="Enter your full name"
// //                         value={formData.name}
// //                         onChange={(e) =>
// //                           setFormData({ ...formData, name: e.target.value })
// //                         }
// //                         className="pl-10  border-border bg-input text-white
// //               placeholder:text-gray-600 rounded-lg shadow-md
// //               focus-visible:!ring-0 focus-visible:!outline-none
// //               focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
// //               transition-all duration-300"
// //                         required
// //                       />
// //                     </div>
// //                   </div>
// //                 )}

// //                 <div className="space-y-2">
// //                   <Label htmlFor="email">Email</Label>
// //                   <div className="relative">
// //                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
// //                     <Input
// //                       id="email"
// //                       type="email"
// //                       placeholder="Enter your email"
// //                       value={formData.email}
// //                       onChange={(e) =>
// //                         setFormData({ ...formData, email: e.target.value })
// //                       }
// //                       className="pl-10  border-border bg-input text-white
// //               placeholder:text-gray-600 rounded-lg  shadow-md
// //               focus-visible:!ring-0 focus-visible:!outline-none
// //               focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
// //               transition-all duration-300"
// //                       required
// //                     />
// //                   </div>
// //                 </div>

// //                 {mode !== "otp" && (
// //                   <div className="space-y-2">
// //                     <Label htmlFor="password">Password</Label>
// //                     <div className="relative">
// //                       <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
// //                       <Input
// //                         id="password"
// //                         type={showPassword ? "text" : "password"}
// //                         placeholder="Enter your password"
// //                         value={formData.password}
// //                         onChange={(e) =>
// //                           setFormData({
// //                             ...formData,
// //                             password: e.target.value,
// //                           })
// //                         }
// //                         className="pl-10 pr-10 border-border bg-input text-white
// //               placeholder:text-gray-600 rounded-lg shadow-md
// //               focus-visible:!ring-0 focus-visible:!outline-none
// //               focus-visible:!shadow-[0_0_15px_rgba(185,32,37,0.8)]
// //               transition-all duration-300"
// //                         required
// //                       />
// //                       <Button
// //                         type="button"
// //                         variant="ghost"
// //                         size="icon"
// //                         className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
// //                         onClick={() => setShowPassword(!showPassword)}
// //                       >
// //                         {showPassword ? (
// //                           <EyeOff className="w-4 h-4 text-muted-foreground" />
// //                         ) : (
// //                           <Eye className="w-4 h-4 text-muted-foreground" />
// //                         )}
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 )}

// //                 <Button
// //                   type="submit"
// //                   className="w-full"
// //                   disabled={isLoading}
// //                 >
// //                   {isLoading
// //                     ? "Loading..."
// //                     : mode === "signin"
// //                     ? "Sign In"
// //                     : "Create Account"}
// //                 </Button>
// //               </form>

// //               <div className="text-center text-sm">
// //                 <span className="text-muted-foreground">
// //                   {mode === "signin"
// //                     ? "Don't have an account? "
// //                     : "Already have an account? "}
// //                 </span>
// //                 <Button
// //                   variant="link"
// //                   className="p-0 h-auto text-primary"
// //                   onClick={() =>
// //                     setMode(mode === "signin" ? "signup" : "signin")
// //                   }
// //                 >
// //                   {mode === "signin" ? "Sign up" : "Sign in"}
// //                 </Button>
// //               </div>

// //               {mode === "signin" && (
// //                 <div className="text-center">
// //                   <Button
// //                     variant="link"
// //                     className="p-0 h-auto text-sm text-muted-foreground"
// //                   >
// //                     Forgot your password?
// //                   </Button>
// //                 </div>
// //               )}
// //             </>
// //           )}
// //         </div>
// //       </DialogContent>
// //     </Dialog>
// //   )
// // }




// "use client"

// import type React from "react"
// import { useState } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Separator } from "@/components/ui/separator"
// import { useAuth } from "@/lib/auth"
// import { Eye, EyeOff, Mail, Lock, User, Chrome, Apple } from "lucide-react"
// import { useToast } from "@/hooks/use-toast"
// import { getApiUrl } from "@/config/api"
// import { AuthStore } from "@/stores/AuthStore"
// import { useStore } from "@/stores/StoreProvider"


// // ❌ OTP Components commented out
// // import {
// //   InputOTP,
// //   InputOTPGroup,
// //   InputOTPSlot,
// // } from "@/components/ui/input-otp"

// // ❌ OTP generator commented
// // function generateOTP(length = 6) {
// //   let otp = ""
// //   for (let i = 0; i < length; i++) {
// //     otp += Math.floor(Math.random() * 10)
// //   }
// //   return otp
// // }

// interface AuthModalProps {
//   isOpen: boolean
//   onClose: () => void
//   defaultMode?: string
// }

// export function AuthModal({
//   isOpen,
//   onClose,
//   defaultMode = "signin",
// }: AuthModalProps) {
//   const [mode, setMode] = useState(defaultMode)
//   const [showPassword, setShowPassword] = useState(false)
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//     name: "",
//     otp: "",
//   })

//   const [isLoading, setIsLoading] = useState(false)

//   const { signIn, signUp, signInWithGoogle, signInWithApple } = useAuth()
//     const { authStore, filterBarStore, flyerFormStore } = useStore()
//   const { toast } = useToast()

//   // const handleSubmit = async (e: React.FormEvent) => {
//   //   e.preventDefault()
//   //   setIsLoading(true)

//   //   try {
//   //     // ✅ DIRECT SIGN-IN (OTP removed)
//   //     if (mode === "signin") {
//   //       await signIn(formData.email, formData.password)

//   //       toast({
//   //         title: "Welcome back!",
//   //         description: "Successfully signed in.",
//   //       })

//   //       setIsLoading(false)
//   //       onClose()
//   //       return
//   //     }

//   //     // ❌ OTP HANDLING REMOVED
//   //     // if (mode === "otp") {
//   //     //   ...
//   //     // }

//   //     // 🔹 SIGN-UP
//   //     if (mode === "signup") {
//   //       await signUp(formData.email, formData.password, formData.name)

//   //       toast({
//   //         title: "Account created!",
//   //         description: "Please check your email for verification.",
//   //       })

//   //       // ❌ No OTP redirection now
//   //       // setMode("otp")

//   //       setMode("signin")
//   //     }
//   //   } catch (error) {
//   //     toast({
//   //       title: "Error",
//   //       description: error instanceof Error ? error.message : "Something went wrong",
//   //       variant: "destructive",
//   //     })
//   //   } finally {
//   //     setIsLoading(false)
//   //   }
//   // }


// //   const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   setIsLoading(true);

// //   try {
// //     // ============================
// //     // ✅ SIGN-IN (LOGIN)
// //     // ============================
// //     if (mode === "signin") {
// //       await signIn(formData.email, formData.password);

// //       toast({
// //         title: "Welcome back!",
// //         description: "Successfully signed in.",
// //       });

// //       onClose();
// //       return;
// //     }

// //     // ============================
// //     // ✅ SIGN-UP (REGISTRATION)
// //     // ============================
// //     if (mode === "signup") {
// //       const res = await fetch("http://193.203.161.174:3007/api/web/auth/register", {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           fullname: formData.name,
// //           email: formData.email,
// //           password: formData.password,
// //         }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || "Registration failed");
// //       }

// //       toast({
// //         title: "Account created!",
// //         description: "Your account has been successfully registered.",
// //       });

// //       // Switch to sign-in mode
// //       setMode("signin");
// //     }
// //   } catch (error) {
// //     toast({
// //       title: "Error",
// //       description: error instanceof Error ? error.message : "Something went wrong",
// //       variant: "destructive",
// //     });
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };


// // const handleSubmit = async (e: React.FormEvent) => {
// //   e.preventDefault();
// //   setIsLoading(true);

// //   try {
// //     // ============================
// //     // ✅ SIGN-IN (LOGIN)
// //     // ============================
// //     if (mode === "signin") {
// //       const res = await fetch(getApiUrl("/api/web/auth/login"), {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           email: formData.email,
// //           password: formData.password,
// //         }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || "Login failed");
// //       }
// //       // await signIn(formData.email, formData.password)
// //       await signIn(data)   // pass real user from backend

// //       toast({
// //         title: "Welcome back!",
// //         description: "Successfully signed in.",
// //       });


// //       // OPTIONAL: save token if backend returns it
// //       // localStorage.setItem("token", data.token);

// //       onClose();
// //       return;
// //     }

// //     // ============================
// //     // ✅ SIGN-UP (REGISTRATION)
// //     // ============================
// //     if (mode === "signup") {
// //       const res = await fetch(getApiUrl("/api/web/auth/register"), {
// //         method: "POST",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         body: JSON.stringify({
// //           fullname: formData.name,
// //           email: formData.email,
// //           password: formData.password,
// //         }),
// //       });

// //       const data = await res.json();

// //       if (!res.ok) {
// //         throw new Error(data.message || "Registration failed");
// //       }

// //       toast({
// //         title: "Account created!",
// //         description: "Your account has been successfully registered.",
// //       });

// //       // After signup → go to login mode
// //       setMode("signin");
// //     }
// //   } catch (error) {
// //     toast({
// //       title: "Error",
// //       description: error instanceof Error ? error.message : "Something went wrong",
// //       variant: "destructive",
// //     });
// //   } finally {
// //     setIsLoading(false);
// //   }
// // };
// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();
//   setIsLoading(true);

//   try {
//     // SIGN IN
//     if (mode === "signin") {
//       // alert(mode);
//       await authStore.login({
//         email: formData.email,
//         password: formData.password,
//       });

//       toast({
//         title: "Welcome back!",
//         description: "Successfully signed in.",
//       });

//       // onClose();
//       return;
//     }

//     // SIGN UP
//     if (mode === "signup") {
//       await authStore.register({
//         fullname: formData.name,
//         email: formData.email,
//         password: formData.password,
//       });

//       toast({
//         title: "Account created!",
//         description: "You can now sign in.",
//       });

//       setMode("signin");
//     }
//   } catch (error: any) {
//     toast({
//       title: "Error",
//       description: error?.message ?? "Something went wrong",
//       variant: "destructive",
//     });
//   } finally {
//     setIsLoading(false);
//   }
// };


//   const handleSocialSignIn = async (provider: "google" | "apple") => {
//     setIsLoading(true)
//     try {
//       provider === "google" ? await signInWithGoogle() : await signInWithApple()
//       toast({
//         title: "Welcome!",
//         description: `Successfully signed in with ${provider}.`,
//       })
//       onClose()
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error instanceof Error ? error.message : "Social sign-in failed",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md bg-card border-border">
//         <DialogHeader>
//           <DialogTitle className="text-center text-card-foreground">
//             {mode === "signin" && "Sign In to Grodify"}
//             {mode === "signup" && "Create Your Account"}
//           </DialogTitle>
//         </DialogHeader>

//         <div className="space-y-6">
//           {/* ❌ Entire OTP screen removed */}

//           <>
//             {/* Social Login */}
//             <div className="space-y-3">
//               <Button
//                 variant="outline"
//                 className="w-full bg-transparent hover:!bg-primary hover:!text-white"
//                 onClick={() => handleSocialSignIn("google")}
//                 disabled={isLoading}
//               >
//                 <Chrome className="w-4 h-4 mr-2" />
//                 Continue with Google
//               </Button>

//               <Button
//                 variant="outline"
//                 className="w-full bg-transparent hover:!bg-primary hover:!text-white"
//                 onClick={() => handleSocialSignIn("apple")}
//                 disabled={isLoading}
//               >
//                 <Apple className="w-4 h-4 mr-2" />
//                 Continue with Apple
//               </Button>
//             </div>

//             <div className="relative">
//               <div className="absolute inset-0 flex items-center">
//                 <Separator className="w-full" />
//               </div>
//               <div className="relative flex justify-center text-xs uppercase">
//                 <span className="bg-card px-2 text-muted-foreground">
//                   Or continue with email
//                 </span>
//               </div>
//             </div>

//             {/* Email / Password form */}
//             <form onSubmit={handleSubmit} className="space-y-4">
//               {mode === "signup" && (
//                 <div className="space-y-2">
//                   <Label>Full Name</Label>
//                   <div className="relative">
//                     <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                     <Input
//                       type="text"
//                       placeholder="Enter your full name"
//                       value={formData.name}
//                       onChange={(e) =>
//                         setFormData({ ...formData, name: e.target.value })
//                       }
//                       required
//                     />
//                   </div>
//                 </div>
//               )}

//               <div className="space-y-2">
//                 <Label>Email</Label>
//                 <div className="relative">
//                   <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                   <Input
//                     type="email"
//                     placeholder="Enter your email"
//                     value={formData.email}
//                     onChange={(e) =>
//                       setFormData({ ...formData, email: e.target.value })
//                     }
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label>Password</Label>
//                 <div className="relative">
//                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
//                   <Input
//                     type={showPassword ? "text" : "password"}
//                     placeholder="Enter your password"
//                     value={formData.password}
//                     onChange={(e) =>
//                       setFormData({ ...formData, password: e.target.value })
//                     }
//                     required
//                   />
//                   <Button
//                     type="button"
//                     variant="ghost"
//                     size="icon"
//                     className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
//                     onClick={() => setShowPassword(!showPassword)}
//                   >
//                     {showPassword ? (
//                       <EyeOff className="w-4 h-4 text-muted-foreground" />
//                     ) : (
//                       <Eye className="w-4 h-4 text-muted-foreground" />
//                     )}
//                   </Button>
//                 </div>
//               </div>

//               <Button type="submit" className="w-full" disabled={isLoading}>
//                 {isLoading
//                   ? "Loading..."
//                   : mode === "signin"
//                   ? "Sign In"
//                   : "Create Account"}
//               </Button>
//             </form>

//             <div className="text-center text-sm">
//               <span className="text-muted-foreground">
//                 {mode === "signin"
//                   ? "Don't have an account? "
//                   : "Already have an account? "}
//               </span>
//               <Button
//                 variant="link"
//                 className="p-0 h-auto text-primary"
//                 onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
//               >
//                 {mode === "signin" ? "Sign up" : "Sign in"}
//               </Button>
//             </div>

//             {mode === "signin" && (
//               <div className="text-center">
//                 <Button
//                   variant="link"
//                   className="p-0 h-auto text-sm text-muted-foreground"
//                 >
//                   Forgot your password?
//                 </Button>
//               </div>
//             )}
//           </>
//         </div>
//       </DialogContent>
//     </Dialog>
//   )
// }









"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Mail, Lock, User, Chrome, Apple } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { observer } from "mobx-react-lite"
import { useStore } from "@/stores/StoreProvider"
import { confirmSignUp as awsConfirmSignUp, resendSignUpCode } from 'aws-amplify/auth'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultMode?: "signin" | "signup"
}

const AuthModal = observer(({
  isOpen,
  onClose,
  defaultMode = "signin",
}: AuthModalProps) => {
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [userPassword, setUserPassword] = useState("") // Store password for auto-login after OTP
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    otp: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const { authStore } = useStore()
  const { toast } = useToast()

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({ name: "", email: "", password: "", otp: "" })
      setShowOtp(false)
      setUserEmail("")
      setUserPassword("") // Clear stored password
      setMode(defaultMode)
      // Clear any existing auth errors when modal closes
      authStore.error = null
    }
  }, [isOpen, defaultMode])

  // Display auth store errors prominently
  useEffect(() => {
    if (authStore.error) {
      toast({
        title: "Authentication Error",
        description: authStore.error,
        variant: "destructive",
      })
    }
  }, [authStore.error, toast])

  const getFriendlyErrorMessage = (error: any): string => {
    // This function is now mainly for fallback, as AuthStore handles most error messages
    const errorMessage = error?.message || 'Something went wrong';

    // Handle any remaining error messages not covered in AuthStore
    if (errorMessage.includes('User already exists')) {
      return 'An account with this email already exists. Please sign in or use a different email.';
    }

    if (errorMessage.includes('Incorrect username or password')) {
      return 'Incorrect email or password. Please try again.';
    }

    if (errorMessage.includes('Password did not conform with policy')) {
      return 'Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.';
    }

    if (errorMessage.includes('Invalid verification code')) {
      return 'The verification code is invalid or has expired. Please request a new one.';
    }

    if (errorMessage.includes('User is not confirmed')) {
      return 'Please verify your email address before signing in. Check your inbox for the verification code.';
    }

    return errorMessage;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (mode === 'signup') {
      if (formData.password.length < 8) {
        toast({
          title: 'Password too short',
          description: 'Password must be at least 8 characters long.',
          variant: 'destructive',
        });
        return;
      }

      if (!/[A-Z]/.test(formData.password)) {
        toast({
          title: 'Password requirements not met',
          description: 'Password must contain at least one uppercase letter (A-Z).',
          variant: 'destructive',
        });
        return;
      }

      if (!/[a-z]/.test(formData.password)) {
        toast({
          title: 'Password requirements not met',
          description: 'Password must contain at least one lowercase letter (a-z).',
          variant: 'destructive',
        });
        return;
      }

      if (!/[0-9]/.test(formData.password)) {
        toast({
          title: 'Password requirements not met',
          description: 'Password must contain at least one number (0-9).',
          variant: 'destructive',
        });
        return;
      }

      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        toast({
          title: 'Password requirements not met',
          description: 'Password must contain at least one special character (e.g., !@#$%^&*).',
          variant: 'destructive',
        });
        return;
      }
    }

    setIsLoading(true)

    try {
      // SIGN IN
      if (mode === "signin") {
        await authStore.login({
          email: formData.email,
          password: formData.password,
        })

        toast({
          title: "Welcome back!",
          description: "Successfully signed in.",
        })
        onClose()
        return
      }

      // SIGN UP
      if (mode === "signup") {
        // Check if email is valid
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          throw new Error('Please enter a valid email address.');
        }

        const registerResult = await authStore.register({
          fullname: formData.name,
          email: formData.email,
          password: formData.password,
        })

        // Handle auto-login success
        if (registerResult.autoLogin && authStore.user) {
          toast({
            title: "🎉 Welcome to Grodify!",
            description: "Your account has been created and you're now logged in.",
          })
          onClose()
          return
        }

        // Handle registration requiring email verification
        if (!registerResult.autoLogin) {
          // Store email and password for auto-login after OTP verification
          setUserEmail(formData.email)
          setUserPassword(formData.password)

          // Show OTP input and store email
          setShowOtp(true)
          setFormData(prev => ({ ...prev, password: "" })) // Clear password field

          toast({
            title: "✅ Account Created!",
            description: registerResult.message || "Please check your email for verification code.",
          })
        }
      }
    } catch (error: any) {
      const friendlyMessage = getFriendlyErrorMessage(error);
      toast({
        title: "Error",
        description: friendlyMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      toast({
        title: "Error",
        description: "Please enter the verification code",
        variant: "destructive",
      })
      return
    }

    try {
      // Use the confirmSignUp method from AWS Amplify to verify the OTP
      const { isSignUpComplete, nextStep } = await awsConfirmSignUp({
        username: userEmail,
        confirmationCode: formData.otp
      });

      if (isSignUpComplete) {
        // Auto-login after successful email verification
        if (userEmail && userPassword) {
          try {
            await authStore.login({
              email: userEmail,
              password: userPassword,
            })

            toast({
              title: "🎉 Welcome to Grodify!",
              description: "Your email has been verified and you're now logged in.",
            })
            onClose()
            return
          } catch (loginError: any) {
            console.error('Auto-login after OTP verification failed:', loginError)
            toast({
              title: "✅ Email Verified!",
              description: "Your email has been verified. Please sign in manually.",
            })
            setShowOtp(false)
            setMode("signin")
            return
          }
        }

        // Fallback if no password stored
        toast({
          title: "✅ Email Verified!",
          description: "Your email has been verified. You can now sign in.",
        })
        setShowOtp(false)
        setMode("signin")
      } else {
        // Handle case where additional steps are needed
        console.log('Additional sign-up steps required:', nextStep);
        toast({
          title: "Additional Steps Required",
          description: "Please complete the additional verification steps.",
          variant: "default",
        })
      }
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      toast({
        title: "Verification Failed",
        description: error?.message || "Invalid verification code",
        variant: "destructive",
      })
    }
  }

  const handleResendOtp = async () => {
    try {
      // Use the resendSignUpCode method from AWS Amplify
      const { destination, deliveryMedium } = await resendSignUpCode({
        username: userEmail
      });

      toast({
        title: "Verification Code Sent",
        description: `A new verification code has been sent to ${destination} via ${deliveryMedium}.`,
      });
    } catch (error: any) {
      console.error('Error resending verification code:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    }
  }

  const handleSocialSignIn = async (provider: "google" | "apple") => {
    try {
      setIsLoading(true)

      // Use direct OAuth (not Cognito)
      if (provider === "google") {
        const { signInWithGoogle } = await import("@/lib/oauth-client")
        await signInWithGoogle()
      } else {
        const { signInWithApple } = await import("@/lib/oauth-client")
        await signInWithApple()
      }

      // The redirect will happen in the OAuth client
      // User will be redirected to /auth/callback/google or /auth/callback/apple
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Social sign-in failed",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-center text-card-foreground">
            {showOtp ? "Verify Your Email" :
              mode === "signin" ? "Sign In to Grodify" : "Create Your Account"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {showOtp ? (
            <div className="space-y-4">
              <p className="text-center text-sm text-muted-foreground">
                Enter the verification code sent to <b>{userEmail}</b>
              </p>

              <div className="space-y-2">
                <Label>Verification Code</Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={formData.otp}
                    onChange={(e) =>
                      setFormData({ ...formData, otp: e.target.value })
                    }
                    className="pl-10"
                  />
                  {/* <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /> */}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleVerifyOtp}
                className="w-full"
                disabled={isLoading || !formData.otp}
              >
                {isLoading ? "Verifying..." : "Verify Code"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Didn't receive a code?{" "}
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  Resend
                </button>
              </p>

              <Button
                type="button"
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => {
                  setShowOtp(false)
                  setMode("signup")
                }}
                disabled={isLoading}
              >
                Back to Sign Up
              </Button>
            </div>
          ) : (
            <>
              {/* Social Login */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent hover:!bg-primary hover:!text-white"
                  onClick={() => handleSocialSignIn("google")}
                  disabled={isLoading}
                >
                  <Chrome className="w-4 h-4 mr-2" />
                  Continue with Google
                </Button>

                <Button
                  variant="outline"
                  className="w-full bg-transparent hover:!bg-primary hover:!text-white"
                  onClick={() => handleSocialSignIn("apple")}
                  disabled={isLoading}
                >
                  <Apple className="w-4 h-4 mr-2" />
                  Continue with Apple
                </Button>
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or continue with email
                  </span>
                </div>
              </div>

              {/* Email / Password form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Inline Error Display */}
                {authStore.error && (
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <div className="text-red-400 text-sm">
                        {authStore.error}
                      </div>
                    </div>
                  </div>
                )}

                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <div className="relative">
                      {/* <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /> */}
                      <Input
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value })
                          // Clear error when user starts typing
                          if (authStore.error) authStore.error = null
                        }}
                        required
                        disabled={isLoading}
                        className={formData.name && formData.name.length < 2 ? "border-red-500/50" : ""}
                      />
                    </div>
                    {formData.name && formData.name.length < 2 && (
                      <div className="text-xs text-red-400">
                        Name must be at least 2 characters long
                      </div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    {/* <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /> */}
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        // Clear error when user starts typing
                        if (authStore.error) authStore.error = null
                      }}
                      required
                      disabled={isLoading}
                      className={
                        formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
                          ? "border-red-500/50"
                          : ""
                      }
                    />
                  </div>
                  {formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                    <div className="text-xs text-red-400">
                      Please enter a valid email address
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Password</Label>
                  <div className="relative">
                    {/* <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" /> */}
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => {
                        setFormData({ ...formData, password: e.target.value })
                        // Clear error when user starts typing
                        if (authStore.error) authStore.error = null
                      }}
                      required
                      disabled={isLoading}
                      className={`pr-10 ${formData.password && formData.password.length > 0 && formData.password.length < 8
                          ? "border-red-500/50"
                          : ""
                        }`}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {mode === "signup" && formData.password && formData.password.length > 0 && (
                    <div className="space-y-1">
                      {formData.password.length < 8 && (
                        <div className="text-xs text-red-400">
                          Password must be at least 8 characters long
                        </div>
                      )}
                      {formData.password.length >= 8 && !/[A-Z]/.test(formData.password) && (
                        <div className="text-xs text-red-400">
                          Must include at least one uppercase letter
                        </div>
                      )}
                      {formData.password.length >= 8 && /[A-Z]/.test(formData.password) && !/[a-z]/.test(formData.password) && (
                        <div className="text-xs text-red-400">
                          Must include at least one lowercase letter
                        </div>
                      )}
                      {formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) && !/[0-9]/.test(formData.password) && (
                        <div className="text-xs text-red-400">
                          Must include at least one number
                        </div>
                      )}
                      {formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[a-z]/.test(formData.password) && /[0-9]/.test(formData.password) && !/[^A-Za-z0-9]/.test(formData.password) && (
                        <div className="text-xs text-red-400">
                          Must include at least one special character
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {mode === "signin" && (
                  <button
                    type="button"
                    className="text-xs text-muted-foreground hover:underline"
                    onClick={() => setMode("forgot")}
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Processing..."
                    : mode === "signin"
                      ? "Sign In"
                      : "Create Account"}
                </Button>
              </form>

              <p className="text-sm text-muted-foreground text-center">
                {mode === "signin"
                  ? "Don't have an account? "
                  : "Already have an account? "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  disabled={isLoading}
                >
                  {mode === "signin" ? "Sign up" : "Sign in"}
                </button>
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
})

export default AuthModal
