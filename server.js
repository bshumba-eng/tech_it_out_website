require("dotenv").config();
const express = require("express");
const path = require("path");
const crypto = require("crypto");
const { createClient } = require("@supabase/supabase-js");
const Stripe = require("stripe");
const { Resend } = require("resend");

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(path.join(__dirname)));

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function clean(v, max=5000) { return String(v ?? "").trim().slice(0,max); }
function adminToken(user) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not configured");
  return crypto.createHmac("sha256", secret).update(user).digest("hex");
}
function requireAdmin(req,res,next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!process.env.ADMIN_EMAIL || token !== adminToken(process.env.ADMIN_EMAIL)) return res.status(401).json({error:"Unauthorised"});
  next();
}

app.post("/api/contact", async (req,res) => {
  try {
    const name=clean(req.body.name,120), email=clean(req.body.email,254), phone=clean(req.body.phone,50);
    const message=clean(req.body.message,5000), type=clean(req.body.type,50), category=clean(req.body.category,100);
    if(!name || !email || !message) return res.status(400).json({error:"Name, email and message are required."});
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({error:"Please enter a valid email address."});
    const {error}=await supabase.from("enquiries").insert({name,email,phone,type,category,message,status:"unread"});
    if(error) throw error;
    if(resend) {
      await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: process.env.NOTIFICATION_EMAIL || "techitout2026@gmail.com",
        subject: `New Tech It Out ${type || "contact"} enquiry`,
        html: `<h2>New Tech It Out enquiry</h2><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Phone:</strong> ${phone||"Not provided"}</p><p><strong>Type:</strong> ${type}</p><p><strong>Category:</strong> ${category}</p><p><strong>Message:</strong><br>${message.replace(/\n/g,"<br>")}</p>`
      });
    }
    res.json({ok:true});
  } catch(e) { console.error(e); res.status(500).json({error:"We could not process your enquiry. Please try again."}); }
});

app.post("/api/admin/login", async (req,res)=>{
  const email=clean(req.body.email,254), password=String(req.body.password||"");
  if(email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) return res.status(401).json({error:"Invalid login details."});
  res.json({token:adminToken(email)});
});

app.get("/api/admin/messages", requireAdmin, async (req,res)=>{
  const {data,error}=await supabase.from("enquiries").select("*").order("created_at",{ascending:false});
  if(error)return res.status(500).json({error:"Unable to load messages."});
  res.json({messages:data,stats:{total:data.length,unread:data.filter(x=>x.status==="unread").length,repairs:data.filter(x=>x.type==="repair").length}});
});

app.post("/api/create-checkout-session", async (req,res)=>{
  if(!stripe) return res.status(503).json({error:"Payments are not configured yet."});
  const priceId=clean(req.body.priceId,100);
  if(!priceId) return res.status(400).json({error:"Missing price ID."});
  const session=await stripe.checkout.sessions.create({
    mode:"payment",
    line_items:[{price:priceId,quantity:1}],
    success_url:`${process.env.PUBLIC_BASE_URL}/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:`${process.env.PUBLIC_BASE_URL}/#contact`
  });
  res.json({url:session.url});
});

app.get("/api/health",(req,res)=>res.json({ok:true,service:"Tech It Out"}));

const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`Tech It Out running on http://localhost:${port}`));