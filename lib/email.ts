// Email service for sending order confirmations using EmailJS
import type { Order, CustomerInfo } from "@/types"

interface EmailData {
  to: string
  subject: string
  html: string
}

// Add your admin email here
const ADMIN_EMAIL = 'pokemonstorepk@example.com' // Replace with your actual admin email

export const sendOrderConfirmationEmail = async (
  customerInfo: CustomerInfo,
  order: Order
): Promise<boolean> => {
  try {
    console.log('📧 Attempting to send emails to customer and admin...')
    
    // Send email to customer
    const customerEmailSent = await sendCustomerEmail(customerInfo, order)
    
    // Send email to admin
    const adminEmailSent = await sendAdminEmail(customerInfo, order)
    
    if (customerEmailSent && adminEmailSent) {
      console.log('✅ Both customer and admin emails sent successfully')
      return true
    } else if (customerEmailSent || adminEmailSent) {
      console.log('⚠️ Partial success - one email sent, one failed')
      return true // Still consider it success if at least one email was sent
    } else {
      console.error('❌ Failed to send both emails')
      logEmailContent(customerInfo, order)
      return false
    }
  } catch (error) {
    console.error('❌ Error sending emails:', error)
    logEmailContent(customerInfo, order)
    return false
  }
}

// Send confirmation email to customer
const sendCustomerEmail = async (
  customerInfo: CustomerInfo,
  order: Order
): Promise<boolean> => {
  try {
    console.log('📧 Sending confirmation email to customer:', customerInfo.email)
    
    const emailSent = await sendEmailWithEmailJS({
      to: customerInfo.email,
      subject: `Order Confirmation - Order #${order.id.slice(-8)}`,
      html: generateCustomerEmailHTML(customerInfo, order),
    }, 'customer')

    if (emailSent) {
      console.log('✅ Customer confirmation email sent to:', customerInfo.email)
      return true
    } else {
      console.error('❌ Failed to send customer email to:', customerInfo.email)
      return false
    }
  } catch (error) {
    console.error('❌ Error sending customer email:', error)
    return false
  }
}

// Send notification email to admin
const sendAdminEmail = async (
  customerInfo: CustomerInfo,
  order: Order
): Promise<boolean> => {
  try {
    console.log('📧 Sending notification email to admin:', ADMIN_EMAIL)
    
    const emailSent = await sendEmailWithEmailJS({
      to: ADMIN_EMAIL,
      subject: `🚨 New Order Alert - #${order.id.slice(-8)} from ${customerInfo.name}`,
      html: generateAdminEmailHTML(customerInfo, order),
    }, 'admin')

    if (emailSent) {
      console.log('✅ Admin notification email sent to:', ADMIN_EMAIL)
      return true
    } else {
      console.error('❌ Failed to send admin email to:', ADMIN_EMAIL)
      return false
    }
  } catch (error) {
    console.error('❌ Error sending admin email:', error)
    return false
  }
}

// Fallback function to log email content when EmailJS fails
const logEmailContent = (customerInfo: CustomerInfo, order: Order) => {
  console.log('📧 Email content (EmailJS failed):')
  console.log('Customer Email:', customerInfo.email)
  console.log('Admin Email:', ADMIN_EMAIL)
  console.log('Subject:', `Order Confirmation - Order #${order.id.slice(-8)}`)
  console.log('Order ID:', order.id)
  console.log('Customer:', customerInfo.name)
  console.log('Total:', order.total)
  console.log('Items:', order.items.map(item => `${item.name} x${item.quantity}`).join(', '))
}

// Generate customer-friendly email HTML
const generateCustomerEmailHTML = (customerInfo: CustomerInfo, order: Order): string => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e8e8e8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="font-weight: 600; color: #B56F76; font-size: 16px;">${item.name}</div>
        <div style="font-size: 14px; color: #777;">Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e8e8e8; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600;">
        Rs${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Poppins', Arial, sans-serif; 
          line-height: 1.6; 
          color: #444; 
          background-color: #f7f7f7; 
          -webkit-font-smoothing: antialiased;
        }
        .container { 
          max-width: 650px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .header { 
          background: linear-gradient(135deg, #B56F76 0%, #8a4c53 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 12px 12px 0 0;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
          transform: rotate(30deg);
        }
        .content { 
          padding: 40px; 
        }
        .order-details { 
          background: #f9f9f9; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 20px 0; 
          border-left: 4px solid #B56F76;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          border-radius: 8px;
          overflow: hidden;
        }
        .items-table th {
          background: #f3f3f3;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #e8e8e8;
          font-family: 'Poppins', Arial, sans-serif;
        }
        .total { 
          background: linear-gradient(to right, #B56F76, #9c5c63); 
          color: white; 
          padding: 20px; 
          border-radius: 8px; 
          text-align: right; 
          font-weight: bold; 
          margin-top: 20px;
          box-shadow: 0 4px 12px rgba(181, 111, 118, 0.2);
        }
        .footer { 
          background: #f5f5f5; 
          padding: 30px; 
          text-align: center; 
          border-radius: 0 0 12px 12px;
          color: #777;
          font-size: 14px;
        }
        .status { 
          display: inline-block; 
          padding: 8px 16px; 
          background: #4CAF50; 
          color: white; 
          border-radius: 20px; 
          font-weight: bold; 
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .thank-you { 
          background: linear-gradient(to right, #4CAF50, #3d8b40); 
          color: white; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 10px 0; 
          text-align: center; 
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
        }
        h1, h2, h3 {
          color: #333;
          margin-top: 0;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        h2 {
          font-size: 22px;
          margin-bottom: 15px;
          font-weight: 600;
          color: #B56F76;
        }
        h3 {
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: 500;
        }
        p {
          margin-bottom: 15px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e8e8, transparent);
          margin: 25px 0;
        }
        .icon {
          display: inline-block;
          margin-right: 10px;
          vertical-align: middle;
        }
        .highlight-box {
          background: #fff8e6;
          border-left: 4px solid #ffc107;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        @media (max-width: 650px) {
          .content {
            padding: 20px;
          }
          .header {
            padding: 30px 20px;
          }
          .order-details {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: white; position: relative; z-index: 2;">✅ Order Confirmed!</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 18px; position: relative; z-index: 2;">Thank you for your order, ${customerInfo.name}!</p>
        </div>
        
        <div class="content">
          <div class="thank-you">
            <strong style="font-size: 18px;">🎉 Your order has been successfully placed!</strong><br>
            We'll contact you shortly to confirm delivery details.
          </div>
          
          <div class="order-details">
            <h2><span class="icon">📋</span> Order Summary</h2>
            <p><strong>Order ID:</strong> #${order.id.slice(-8)}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> <span class="status">${order.status.toUpperCase()}</span></p>
            <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'}</p>
          </div>
          
          <div class="order-details">
            <h2><span class="icon">📍</span> Delivery Information</h2>
            <p><strong>Delivery Address:</strong> ${customerInfo.address}, ${customerInfo.city} - ${customerInfo.pincode}</p>
            <p><strong>Contact Number:</strong> ${customerInfo.phone}</p>
            <p><strong>Estimated Delivery:</strong> 3-5 business days</p>
          </div>
          
          <div class="order-details">
            <h2><span class="icon">🛍️</span> Order Items</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Item</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
            
            <div class="total">
              <div style="margin-bottom: 8px;">Subtotal: Rs${order.paymentMethod === 'cod' ? (order.total - 200).toLocaleString() : order.total.toLocaleString()}</div>
              ${order.paymentMethod === 'cod' ? '<div style="margin-bottom: 8px;">COD Charge: Rs200</div>' : ''}
              <div style="font-size: 20px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
                Total: Rs${order.total.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div class="highlight-box">
            <h3 style="color: #856404; margin-top: 0;"><span class="icon">📞</span> What's Next?</h3>
            <p>• We'll call you within 24 hours to confirm your order</p>
            <p>• Your items will be carefully packaged and shipped</p>
            <p>• You'll pay Rs${order.total.toLocaleString()} ${order.paymentMethod === 'cod' ? 'when your order arrives' : 'via online payment'}</p>
            <p>• Track your order status via email updates</p>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>Thank you for choosing Pokemonstorepk!</strong></p>
          <p>For any questions, feel free to contact us.</p>
          <div class="divider"></div>
          <p style="font-size: 12px; color: #999;">
            Order ID: ${order.id} | ${orderDate}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// Generate admin notification email HTML
const generateAdminEmailHTML = (customerInfo: CustomerInfo, order: Order): string => {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  const itemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #e8e8e8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="font-weight: 600; color: #B56F76; font-size: 16px;">${item.name}</div>
        <div style="font-size: 14px; color: #777;">Quantity: ${item.quantity}</div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #e8e8e8; text-align: right; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; font-weight: 600;">
        Rs${(item.price * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Order Alert - Admin Notification</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
        
        body { 
          margin: 0; 
          padding: 0; 
          font-family: 'Poppins', Arial, sans-serif; 
          line-height: 1.6; 
          color: #444; 
          background-color: #f7f7f7; 
          -webkit-font-smoothing: antialiased;
        }
        .container { 
          max-width: 650px; 
          margin: 0 auto; 
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        .header { 
          background: linear-gradient(135deg, #ff6b35 0%, #e65c2b 100%); 
          color: white; 
          padding: 40px 30px; 
          text-align: center; 
          border-radius: 12px 12px 0 0;
          position: relative;
          overflow: hidden;
        }
        .header::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
          transform: rotate(30deg);
        }
        .content { 
          padding: 40px; 
        }
        .order-details { 
          background: #f9f9f9; 
          padding: 25px; 
          border-radius: 10px; 
          margin: 20px 0; 
          border-left: 4px solid #ff6b35;
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
        }
        .items-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          box-shadow: 0 2px 8px rgba(0,0,0,0.03);
          border-radius: 8px;
          overflow: hidden;
        }
        .items-table th {
          background: #f3f3f3;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #e8e8e8;
          font-family: 'Poppins', Arial, sans-serif;
        }
        .total { 
          background: linear-gradient(to right, #B56F76, #9c5c63); 
          color: white; 
          padding: 20px; 
          border-radius: 8px; 
          text-align: right; 
          font-weight: bold; 
          margin-top: 20px;
          box-shadow: 0 4px 12px rgba(181, 111, 118, 0.2);
        }
        .footer { 
          background: #f5f5f5; 
          padding: 30px; 
          text-align: center; 
          border-radius: 0 0 12px 12px;
          color: #777;
          font-size: 14px;
        }
        .status { 
          display: inline-block; 
          padding: 8px 16px; 
          background: #FFD700; 
          color: #333; 
          border-radius: 20px; 
          font-weight: bold; 
          font-size: 12px;
          letter-spacing: 0.5px;
        }
        .urgent { 
          background: linear-gradient(to right, #ff4444, #d83636); 
          color: white; 
          padding: 20px; 
          border-radius: 10px; 
          margin: 20px 0; 
          text-align: center; 
          box-shadow: 0 4px 12px rgba(255, 68, 68, 0.2);
        }
        .action-buttons { 
          text-align: center; 
          margin: 30px 0; 
        }
        .action-btn { 
          display: inline-block; 
          padding: 14px 28px; 
          margin: 8px; 
          background: #B56F76; 
          color: white; 
          text-decoration: none; 
          border-radius: 8px; 
          font-weight: bold; 
          font-size: 14px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 8px rgba(181, 111, 118, 0.3);
        }
        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(181, 111, 118, 0.4);
        }
        .priority { 
          background: linear-gradient(to right, #ff6b35, #e65c2b); 
          color: white; 
          padding: 18px; 
          border-radius: 10px; 
          margin: 20px 0; 
          font-weight: bold; 
          text-align: center;
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);
        }
        .checklist {
          background: #fff8e6;
          border-left: 4px solid #ffc107;
          padding: 25px;
          border-radius: 10px;
          margin: 25px 0;
        }
        .checklist p {
          margin-bottom: 12px;
          padding-left: 30px;
          position: relative;
        }
        .checklist p::before {
          content: "☐";
          position: absolute;
          left: 0;
          font-size: 18px;
          color: #856404;
        }
        h1, h2, h3 {
          color: #333;
          margin-top: 0;
        }
        h1 {
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        h2 {
          font-size: 22px;
          margin-bottom: 15px;
          font-weight: 600;
          color: #ff6b35;
        }
        h3 {
          font-size: 18px;
          margin-bottom: 15px;
          font-weight: 500;
        }
        p {
          margin-bottom: 15px;
        }
        .divider {
          height: 1px;
          background: linear-gradient(to right, transparent, #e8e8e8, transparent);
          margin: 25px 0;
        }
        .icon {
          display: inline-block;
          margin-right: 10px;
          vertical-align: middle;
        }
        @media (max-width: 650px) {
          .content {
            padding: 20px;
          }
          .header {
            padding: 30px 20px;
          }
          .order-details {
            padding: 20px;
          }
          .action-btn {
            display: block;
            margin: 10px 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: white; position: relative; z-index: 2;">🚨 NEW ORDER ALERT!</h1>
          <p style="color: rgba(255,255,255,0.9); font-size: 18px; position: relative; z-index: 2;">Order #${order.id.slice(-8)} - ${orderDate}</p>
          <p style="color: rgba(255,255,255,0.9); font-size: 20px; margin-top: 15px; position: relative; z-index: 2;">💰 Total: Rs${order.total.toLocaleString()}</p>
        </div>
        
        <div class="content">
          <div class="urgent">
            <strong style="font-size: 18px;">⚡ IMMEDIATE ACTION REQUIRED!</strong><br>
            New customer order needs processing and confirmation call
          </div>
          
          <div class="priority">
            🎯 <strong>Priority:</strong> Call customer within 2 hours to confirm order
          </div>
          
          <div class="order-details">
            <h2><span class="icon">📋</span> Order Details</h2>
            <p><strong>Order ID:</strong> #${order.id.slice(-8)}</p>
            <p><strong>Order Date:</strong> ${orderDate}</p>
            <p><strong>Status:</strong> <span class="status">${order.status.toUpperCase()}</span></p>
            <p><strong>Payment:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment'} - Rs${order.total.toLocaleString()}</p>
          </div>
          
          <div class="order-details" style="background: #e8f5e8; border-left-color: #4CAF50;">
            <h2><span class="icon">👤</span> Customer Information</h2>
            <p><strong>Name:</strong> ${customerInfo.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${customerInfo.email}" style="color: #B56F76; text-decoration: none;">${customerInfo.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${customerInfo.phone}" style="color: #B56F76; text-decoration: none;">${customerInfo.phone}</a></p>
            <p><strong>Address:</strong> ${customerInfo.address}, ${customerInfo.city} - ${customerInfo.pincode}</p>
          </div>
          
          <div class="order-details">
            <h2><span class="icon">🛍️</span> Items Ordered</h2>
            <table class="items-table">
              <thead>
                <tr>
                  <th style="text-align: left;">Product</th>
                  <th style="text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
            
            <div class="total">
              <div style="margin-bottom: 8px;">Subtotal: Rs${order.paymentMethod === 'cod' ? (order.total - 200).toLocaleString() : order.total.toLocaleString()}</div>
              ${order.paymentMethod === 'cod' ? '<div style="margin-bottom: 8px;">COD Charge: Rs200</div>' : ''}
              <div style="font-size: 22px; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.3);">
                💰 TOTAL ${order.paymentMethod === 'cod' ? 'TO COLLECT' : 'PAID'}: Rs${order.total.toLocaleString()}
              </div>
            </div>
          </div>
          
          <div class="checklist">
            <h3 style="color: #856404; margin-top: 0;"><span class="icon">📋</span> Action Checklist</h3>
            <p><strong>1. Call Customer:</strong> ${customerInfo.phone} (${customerInfo.name})</p>
            <p><strong>2. Confirm Items:</strong> Verify all ${order.items.length} items are available</p>
            <p><strong>3. Confirm Address:</strong> ${customerInfo.address}, ${customerInfo.city}</p>
            <p><strong>4. Set Delivery Date:</strong> Schedule within 3-5 business days</p>
            <p><strong>5. Update Status:</strong> Mark as "Confirmed" in admin panel</p>
            <p><strong>6. Prepare Invoice:</strong> Total Rs${order.total.toLocaleString()} (${order.paymentMethod === 'cod' ? 'COD' : 'Online Payment'})</p>
          </div>
          
          <div class="action-buttons">
            <a href="tel:${customerInfo.phone}" class="action-btn" style="background: linear-gradient(to right, #28a745, #219e39);">
              📞 CALL NOW: ${customerInfo.phone}
            </a>
            <a href="mailto:${customerInfo.email}" class="action-btn">
              📧 EMAIL CUSTOMER
            </a>
            <a href="sms:${customerInfo.phone}?body=Hi ${customerInfo.name}, thank you for your order #${order.id.slice(-8)}. We'll deliver within 3-5 days. Total: Rs${order.total} (COD)" class="action-btn" style="background: linear-gradient(to right, #17a2b8, #13899c);">
              💬 SEND SMS
            </a>
          </div>
        </div>
        
        <div class="footer">
          <p><strong>🏪 Pokemonstorepk - Order Management System</strong></p>
          <p style="color: #666;">This order was placed at ${orderDate}</p>
          <div class="divider"></div>
          <p style="font-size: 12px; color: #999;">
            Order ID: ${order.id}<br>
            Customer: ${customerInfo.email} | Phone: ${customerInfo.phone}
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// EmailJS integration with email type specification
export const sendEmailWithEmailJS = async (
  emailData: EmailData, 
  emailType: 'customer' | 'admin' = 'customer'
): Promise<boolean> => {
  try {
    console.log(`📧 Initializing EmailJS for ${emailType} email...`)
    
    // Import EmailJS dynamically
    const { init, send } = await import('@emailjs/browser')
    
    // Initialize EmailJS with your public key
    init('NDs6eX7dIROitjxXZ')
    
    console.log(`📧 Sending ${emailType} email via EmailJS...`)
    
    // Different template parameters based on email type
    const templateParams = emailType === 'admin' ? {
      // Admin email parameters
      to_email: emailData.to,
      subject: emailData.subject,
      message: emailData.html,
      email_type: 'admin_notification',
      
      // Extract info from subject for admin
      order_id: emailData.subject.split('#')[1]?.split(' ')[0] || 'N/A',
      customer_name: emailData.subject.includes('from') ? emailData.subject.split('from ')[1] : 'Unknown',
    } : {
      // Customer email parameters
      to_email: emailData.to,
      subject: emailData.subject,
      message: emailData.html,
      email_type: 'customer_confirmation',
      
      // Extract customer info
      customer_email: emailData.to,
      order_id: emailData.subject.split('#')[1]?.split(' ')[0] || 'N/A',
    }
    
    const result = await send(
      'service_lmpnzy7', // Your service ID
      'template_3mxyakk', // Your template ID (you might want different templates for customer vs admin)
      templateParams,
      '1fNd3XGZT0t_hQazv' // Your public key
    )
    
    console.log(`✅ ${emailType} email sent via EmailJS:`, result)
    return true
  } catch (error: any) {
    console.error(`❌ EmailJS error for ${emailType} email:`, error)
    
    // Check if it's a Gmail API issue
    if (error.status === 412 && error.text?.includes('Gmail_API')) {
      console.error('⚠️ Gmail API issue detected. Please reconnect your Gmail account in EmailJS dashboard.')
      console.error('📧 To fix this:')
      console.error('1. Go to EmailJS Dashboard')
      console.error('2. Navigate to Email Services')
      console.error('3. Reconnect your Gmail account')
      console.error('4. Or use a different email service like Outlook, Yahoo, etc.')
    }
    
    return false
  }
}

// Alternative method - send both emails with single EmailJS call
export const sendBothEmailsSimultaneously = async (
  customerInfo: CustomerInfo,
  order: Order
): Promise<boolean> => {
  try {
    console.log('📧 Sending both customer and admin emails simultaneously...')
    
    // Import EmailJS dynamically
    const { init, send } = await import('@emailjs/browser')
    
    // Initialize EmailJS
    init('NDs6eX7dIROitjxXZ')
    
    // Send both emails with a single template that handles both recipients
    const result = await send(
      'service_qk1jv8t',
      'template_ich1tmu', // You might need a special template for this
      {
        // Customer info
        customer_email: customerInfo.email,
        customer_name: customerInfo.name,
        customer_phone: customerInfo.phone,
        customer_address: `${customerInfo.address}, ${customerInfo.city} - ${customerInfo.pincode}`,
        
        // Admin info
        admin_email: ADMIN_EMAIL,
        
        // Order info
        order_id: order.id.slice(-8),
        order_total: order.total,
        order_items: order.items.map(item => `${item.name} x${item.quantity}`).join(', '),
        order_date: new Date(order.createdAt).toLocaleDateString(),
        
        // Email content
        customer_message: generateCustomerEmailHTML(customerInfo, order),
        admin_message: generateAdminEmailHTML(customerInfo, order),
        
        // Flags
        send_to_customer: true,
        send_to_admin: true,
      },
      '1fNd3XGZT0t_hQazv'
    )
    
    console.log('✅ Both emails sent simultaneously via EmailJS:', result)
    return true
  } catch (error: any) {
    console.error('❌ Simultaneous email sending failed:', error)
    
    // Fallback: try sending them separately
    console.log('📧 Falling back to separate email sending...')
    return await sendOrderConfirmationEmail(customerInfo, order)
  }
}