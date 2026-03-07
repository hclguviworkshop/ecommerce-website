import { useState } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Nunito:wght@300;400;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --teal: #1a7a5e;
    --purple: #7B2D8B;
    --text: #1a1a1a;
    --muted: #666;
    --bg: #faf8f5;
  }

  html, body, #root {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    font-family: 'Nunito', sans-serif;
  }

  .app {
    width: 100vw;
    height: 100vh;
    overflow-y: scroll;
    overflow-x: hidden;
    scroll-snap-type: y mandatory;
    -webkit-overflow-scrolling: touch;
  }

  .page {
    width: 100vw;
    height: 100vh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    position: relative;
    overflow: hidden;
  }

  .home { background: #fff; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .home-logo { width: clamp(240px, 35vw, 480px); animation: popIn 1s cubic-bezier(0.22,1,0.36,1) both; }
  @keyframes popIn { from { opacity:0; transform: scale(0.88) translateY(24px); } to { opacity:1; transform: none; } }
  .home-tagline { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(14px, 1.4vw, 20px); color: var(--muted); letter-spacing: 0.14em; margin-top: 12px; animation: fadeUp 1s 0.4s both; }
  .home-hint { position: absolute; bottom: 36px; left: 50%; transform: translateX(-50%); display: flex; flex-direction: column; align-items: center; gap: 8px; cursor: pointer; animation: fadeUp 1s 0.8s both; }
  .home-hint span { font-size: 11px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: var(--purple); }
  .chevron { width: 24px; height: 24px; border-right: 2.5px solid var(--purple); border-bottom: 2.5px solid var(--purple); transform: rotate(45deg); animation: bounce 1.5s infinite; }
  @keyframes bounce { 0%,100% { transform: rotate(45deg) translateY(0); } 50% { transform: rotate(45deg) translateY(7px); } }
  @keyframes fadeUp { from { opacity:0; transform: translateY(14px); } to { opacity:1; transform: none; } }

  .topnav { width: 100%; background: #fff; border-bottom: 1px solid #eee; padding: 0 48px; height: 60px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .nav-logo { width: 80px; cursor: pointer; }
  .nav-links { display: flex; gap: 24px; }
  .nav-links span { font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); cursor: pointer; transition: color 0.2s; }
  .nav-links span:hover, .nav-links span.active { color: var(--teal); }
  .nav-icons { display: flex; gap: 16px; font-size: 18px; cursor: pointer; align-items: center; }
  .cart-badge { position: relative; cursor: pointer; }
  .badge { position: absolute; top: -6px; right: -6px; background: var(--purple); color: #fff; font-size: 9px; font-weight: 700; width: 16px; height: 16px; border-radius: 50%; display: flex; align-items: center; justify-content: center; }

  .listing { background: var(--bg); display: flex; flex-direction: column; }
  .listing-content { flex: 1; overflow-y: auto; padding: 24px 48px 32px; }
  .listing-top { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 16px; }
  .listing-heading { font-family: 'Cormorant Garamond', serif; font-size: 26px; font-style: italic; color: var(--text); }
  .item-count { font-size: 12px; color: var(--muted); }
  .filters { display: flex; gap: 8px; margin-bottom: 20px; flex-wrap: wrap; }
  .chip { padding: 5px 15px; border-radius: 20px; border: 1.5px solid #ddd; background: #fff; font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 600; color: var(--muted); cursor: pointer; transition: all 0.2s; }
  .chip:hover { border-color: var(--teal); color: var(--teal); }
  .chip.on { background: var(--teal); color: #fff; border-color: var(--teal); }
  .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px; }
  .pcard { background: #fff; border-radius: 4px; border: 1px solid #eee; overflow: hidden; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
  .pcard:hover { transform: translateY(-4px); box-shadow: 0 8px 28px rgba(26,122,94,0.13); }
  .pcard-img { width: 100%; aspect-ratio: 3/4; background: #f5f0eb; display: flex; align-items: center; justify-content: center; font-size: 52px; }
  .pcard-body { padding: 10px 12px 12px; }
  .pcard-tag { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--purple); margin-bottom: 3px; }
  .pcard-name { font-family: 'Cormorant Garamond', serif; font-size: 15px; color: var(--text); margin-bottom: 2px; }
  .pcard-sub { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
  .pcard-foot { display: flex; align-items: center; justify-content: space-between; }
  .pcard-price { font-size: 14px; font-weight: 700; color: var(--teal); }
  .pcard-orig { font-size: 11px; color: #bbb; text-decoration: line-through; margin-left: 5px; }
  .heart { background: none; border: none; font-size: 16px; cursor: pointer; color: #ddd; transition: color 0.2s; }
  .heart.on { color: var(--purple); }

  .detail { background: #fff; display: flex; flex-direction: column; }
  .detail-content { flex: 1; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 52px; padding: 32px 80px; max-width: 1100px; margin: 0 auto; width: 100%; }
  .big-img { width: 100%; aspect-ratio: 3/4; background: #f5f0eb; border-radius: 4px; border: 1px solid #eee; display: flex; align-items: center; justify-content: center; font-size: 110px; }
  .thumbs { display: flex; gap: 10px; margin-top: 12px; }
  .thumb { width: 58px; height: 58px; background: #f5f0eb; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 22px; border: 1.5px solid transparent; cursor: pointer; }
  .thumb.on { border-color: var(--teal); }
  .detail-right { padding-top: 4px; }
  .d-badge { display: inline-block; background: #f0faf5; color: var(--teal); font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; margin-bottom: 12px; }
  .d-name { font-family: 'Cormorant Garamond', serif; font-size: 30px; color: var(--text); margin-bottom: 4px; line-height: 1.2; }
  .d-brand { font-size: 13px; color: var(--muted); margin-bottom: 14px; }
  .d-price-row { display: flex; align-items: baseline; gap: 10px; margin-bottom: 18px; }
  .d-price { font-size: 26px; font-weight: 700; color: var(--teal); }
  .d-orig { font-size: 16px; color: #bbb; text-decoration: line-through; }
  .d-save { font-size: 11px; color: var(--purple); font-weight: 700; background: #faf0ff; padding: 3px 10px; border-radius: 20px; }
  .d-divider { height: 1px; background: #f0f0f0; margin: 14px 0; }
  .d-label { font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); margin-bottom: 8px; }
  .sizes { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .sz { padding: 7px 16px; border: 1.5px solid #ddd; border-radius: 3px; background: #fff; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 600; color: var(--text); cursor: pointer; transition: all 0.2s; }
  .sz:hover { border-color: var(--teal); color: var(--teal); }
  .sz.on { background: var(--teal); color: #fff; border-color: var(--teal); }
  .condition-row { display: flex; align-items: center; gap: 10px; margin-bottom: 18px; }
  .cond-dot { width: 10px; height: 10px; border-radius: 50%; background: #27ae60; }
  .cond-text { font-size: 13px; font-weight: 600; color: var(--text); }
  .cond-sub { font-size: 11px; color: var(--muted); }
  .btn-cart { width: 100%; padding: 13px; background: var(--teal); color: #fff; border: none; border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 10px; box-shadow: 0 3px 0 #0e5c44; transition: background 0.2s; }
  .btn-cart:hover { background: #156b50; }
  .btn-wish { width: 100%; padding: 12px; background: #fff; color: var(--purple); border: 1.5px solid var(--purple); border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; transition: background 0.2s; }
  .btn-wish:hover { background: #faf0ff; }
  .meta { margin-top: 18px; display: flex; flex-direction: column; }
  .meta-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); padding: 8px 0; border-bottom: 1px solid #f5f5f5; }
  .meta-row b { color: var(--text); font-weight: 600; }

  .auth { display: flex; align-items: center; justify-content: center; }
  .auth-bg { position: absolute; inset: 0; background-image: url('/bg-pattern.jpg'); background-size: cover; background-position: center; }
  .auth-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.72); }
  .auth-card { position: relative; z-index: 2; width: 90%; max-width: 460px; background: rgba(255,255,255,0.96); border-radius: 4px; border: 1px solid rgba(123,45,139,0.14); box-shadow: 0 4px 0 var(--teal), 0 16px 60px rgba(26,122,94,0.18); overflow: hidden; }
  .card-top { display: flex; justify-content: center; padding: 22px 32px 0; }
  .card-logo { width: 120px; }
  .tabs { display: grid; grid-template-columns: 1fr 1fr; margin: 16px 32px 0; border-bottom: 2px solid #eee; }
  .tab { padding: 10px 0; background: none; border: none; font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #bbb; cursor: pointer; position: relative; transition: color 0.2s; }
  .tab.on { color: var(--purple); }
  .tab.on::after { content: ''; position: absolute; bottom: -2px; left: 0; right: 0; height: 2.5px; background: var(--purple); border-radius: 2px 2px 0 0; }
  .card-body { padding: 18px 32px 26px; }
  .row2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .field { margin-bottom: 13px; }
  .field label { display: block; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); margin-bottom: 5px; }
  .field input { width: 100%; padding: 10px 13px; border: 1.5px solid #e0e0e0; border-radius: 3px; background: #fafafa; font-family: 'Nunito', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.2s, box-shadow 0.2s; }
  .field input:focus { border-color: var(--purple); background: #fff; box-shadow: 0 0 0 3px rgba(123,45,139,0.09); }
  .field input::placeholder { color: #ccc; }
  .pw-wrap { position: relative; }
  .pw-wrap input { padding-right: 36px; }
  .eye { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #bbb; font-size: 14px; }
  .str-row { display: flex; gap: 3px; margin-top: 5px; }
  .s { height: 3px; flex: 1; border-radius: 2px; background: #eee; transition: background 0.3s; }
  .s.w { background: #c0392b; } .s.f { background: #e67e22; } .s.g { background: var(--teal); } .s.x { background: #27ae60; }
  .ferr { font-size: 11px; color: #c0392b; margin-top: 3px; }
  .chk { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 16px; }
  .chk input { width: 14px; height: 14px; margin-top: 2px; accent-color: var(--purple); cursor: pointer; flex-shrink: 0; }
  .chk label { font-size: 11px; color: var(--muted); line-height: 1.6; cursor: pointer; }
  .chk label a { color: var(--purple); font-weight: 700; text-decoration: none; }
  .btn-sub { width: 100%; padding: 12px; background: var(--teal); color: #fff; border: none; border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-bottom: 12px; box-shadow: 0 3px 0 #0e5c44; transition: background 0.2s; }
  .btn-sub:hover { background: #156b50; }
  .btn-sub:disabled { opacity: 0.6; cursor: not-allowed; }
  .divider { display: flex; align-items: center; gap: 10px; color: #ccc; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px; }
  .divider::before, .divider::after { content:''; flex:1; height:1px; background:#eee; }
  .socs { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
  .soc { display: flex; align-items: center; justify-content: center; gap: 7px; padding: 9px; border: 1.5px solid #e8e8e8; border-radius: 3px; background: #fff; font-family: 'Nunito', sans-serif; font-size: 12px; color: var(--text); font-weight: 600; cursor: pointer; transition: border-color 0.2s; }
  .soc:hover { border-color: #ccc; }
  .forgot { display: block; text-align: right; font-size: 11px; color: var(--purple); text-decoration: none; font-weight: 600; margin-top: -8px; margin-bottom: 14px; }
  .done { text-align: center; padding: 10px 0; }
  .done-icon { width: 54px; height: 54px; background: linear-gradient(135deg, var(--teal), #2ecc9a); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; font-size: 22px; color: #fff; }
  .done h3 { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic; color: var(--text); margin-bottom: 6px; }
  .done p { font-size: 12px; color: var(--muted); line-height: 1.7; }

  .cartpage { background: var(--bg); display: flex; flex-direction: column; }
  .page-content { flex: 1; overflow-y: auto; padding: 28px 48px 32px; }
  .page-heading { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-style: italic; color: var(--text); margin-bottom: 24px; }
  .cart-grid { display: grid; grid-template-columns: 1fr 340px; gap: 28px; }
  .cart-items { display: flex; flex-direction: column; gap: 14px; }
  .cart-item { background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 16px; display: flex; gap: 16px; align-items: flex-start; }
  .cart-item-emoji { width: 70px; height: 90px; background: #f5f0eb; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 34px; flex-shrink: 0; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-family: 'Cormorant Garamond', serif; font-size: 17px; color: var(--text); margin-bottom: 2px; }
  .cart-item-sub { font-size: 11px; color: var(--muted); margin-bottom: 8px; }
  .cart-item-foot { display: flex; align-items: center; justify-content: space-between; }
  .cart-item-price { font-size: 16px; font-weight: 700; color: var(--teal); }
  .qty-ctrl { display: flex; align-items: center; gap: 8px; }
  .qty-btn { width: 26px; height: 26px; border: 1.5px solid #ddd; border-radius: 3px; background: #fff; font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: border-color 0.2s; }
  .qty-btn:hover { border-color: var(--teal); color: var(--teal); }
  .qty-num { font-size: 13px; font-weight: 700; color: var(--text); min-width: 16px; text-align: center; }
  .remove-btn { background: none; border: none; font-size: 13px; color: #e74c3c; cursor: pointer; font-weight: 600; }
  .cart-summary { background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 24px; height: fit-content; }
  .summary-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; color: var(--text); margin-bottom: 18px; }
  .summary-row { display: flex; justify-content: space-between; font-size: 13px; color: var(--muted); padding: 7px 0; border-bottom: 1px solid #f5f5f5; }
  .summary-row.total { font-size: 16px; font-weight: 700; color: var(--text); border-bottom: none; margin-top: 4px; }
  .btn-checkout { width: 100%; padding: 13px; background: var(--teal); color: #fff; border: none; border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 16px; box-shadow: 0 3px 0 #0e5c44; transition: background 0.2s; }
  .btn-checkout:hover { background: #156b50; }
  .empty-cart { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60%; gap: 12px; }
  .empty-cart span { font-size: 52px; }
  .empty-cart p { font-family: 'Cormorant Garamond', serif; font-size: 22px; font-style: italic; color: #aaa; }
  .empty-cart button { margin-top: 8px; padding: 10px 28px; background: var(--teal); color: #fff; border: none; border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; }

  .checkout { background: var(--bg); display: flex; flex-direction: column; }
  .checkout-grid { display: grid; grid-template-columns: 1fr 320px; gap: 28px; }
  .checkout-section { background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 22px; margin-bottom: 16px; }
  .section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); margin-bottom: 16px; }
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  .form-field { display: flex; flex-direction: column; gap: 5px; }
  .form-field label { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); }
  .form-field input, .form-field select { padding: 9px 12px; border: 1.5px solid #e0e0e0; border-radius: 3px; background: #fafafa; font-family: 'Nunito', sans-serif; font-size: 13px; color: var(--text); outline: none; transition: border-color 0.2s; }
  .form-field input:focus, .form-field select:focus { border-color: var(--purple); background: #fff; }
  .form-field.full { grid-column: 1 / -1; }
  .pay-methods { display: flex; gap: 10px; margin-bottom: 16px; }
  .pay-method { flex: 1; padding: 12px; border: 1.5px solid #ddd; border-radius: 3px; text-align: center; cursor: pointer; font-size: 12px; font-weight: 600; color: var(--muted); transition: all 0.2s; }
  .pay-method.on { border-color: var(--teal); color: var(--teal); background: #f0faf5; }
  .order-summary-box { background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 22px; height: fit-content; }
  .order-item-row { display: flex; gap: 10px; align-items: center; margin-bottom: 12px; }
  .order-item-emoji { width: 44px; height: 44px; background: #f5f0eb; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .order-item-name { font-size: 12px; font-weight: 600; color: var(--text); }
  .order-item-sub { font-size: 11px; color: var(--muted); }
  .order-item-price { margin-left: auto; font-size: 13px; font-weight: 700; color: var(--teal); }
  .place-order-btn { width: 100%; padding: 13px; background: var(--purple); color: #fff; border: none; border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 16px; box-shadow: 0 3px 0 #5a1a6b; transition: background 0.2s; }
  .place-order-btn:hover { background: #6a2578; }
  .order-placed { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; gap: 14px; text-align: center; padding: 0 48px; }
  .order-placed-icon { width: 70px; height: 70px; background: linear-gradient(135deg, var(--teal), #2ecc9a); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 30px; color: #fff; }
  .order-placed h2 { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-style: italic; color: var(--text); }
  .order-placed p { font-size: 13px; color: var(--muted); max-width: 320px; line-height: 1.7; }
  .order-placed button { margin-top: 8px; padding: 11px 28px; background: var(--teal); color: #fff; border: none; border-radius: 3px; font-family: 'Nunito', sans-serif; font-size: 13px; font-weight: 700; cursor: pointer; }

  .history { background: var(--bg); display: flex; flex-direction: column; }
  .order-card { background: #fff; border: 1px solid #eee; border-radius: 4px; padding: 20px; margin-bottom: 14px; }
  .order-card-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
  .order-id { font-size: 12px; font-weight: 700; color: var(--text); }
  .order-date { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .order-status { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; }
  .status-delivered { background: #f0faf5; color: var(--teal); }
  .status-shipped { background: #fff8e1; color: #f39c12; }
  .status-processing { background: #faf0ff; color: var(--purple); }
  .order-items-row { display: flex; gap: 10px; margin-bottom: 14px; flex-wrap: wrap; align-items: center; }
  .order-thumb { width: 52px; height: 52px; background: #f5f0eb; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 22px; }
  .order-card-foot { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f5f5f5; padding-top: 12px; }
  .order-total { font-size: 15px; font-weight: 700; color: var(--teal); }
  .reorder-btn { padding: 7px 18px; border: 1.5px solid var(--teal); border-radius: 3px; background: #fff; color: var(--teal); font-family: 'Nunito', sans-serif; font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .reorder-btn:hover { background: var(--teal); color: #fff; }

  .admin { background: #f0f4f8; display: flex; flex-direction: column; }
  .admin-topnav { width: 100%; background: var(--teal); padding: 0 48px; height: 60px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; }
  .admin-topnav-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-style: italic; color: #fff; }
  .admin-badge { background: rgba(255,255,255,0.2); color: #fff; font-size: 11px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
  .admin-content { flex: 1; overflow-y: auto; padding: 24px 48px 32px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
  .stat-card { background: #fff; border-radius: 4px; border: 1px solid #e0e8e4; padding: 20px; }
  .stat-icon { font-size: 28px; margin-bottom: 8px; }
  .stat-val { font-size: 26px; font-weight: 700; color: var(--text); margin-bottom: 2px; }
  .stat-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .stat-change { font-size: 11px; font-weight: 700; margin-top: 6px; }
  .up { color: #27ae60; } .down { color: #e74c3c; }
  .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .admin-section { background: #fff; border-radius: 4px; border: 1px solid #e0e8e4; padding: 20px; }
  .admin-section-title { font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: var(--teal); margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
  .admin-section-title span { font-size: 10px; color: var(--purple); cursor: pointer; font-weight: 600; letter-spacing: 0; text-transform: none; }
  .admin-order-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
  .admin-order-row:last-child { border-bottom: none; }
  .admin-order-id { font-size: 12px; font-weight: 700; color: var(--text); flex: 1; }
  .admin-order-user { font-size: 11px; color: var(--muted); }
  .admin-order-amt { font-size: 13px; font-weight: 700; color: var(--teal); }
  .admin-product-row { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
  .admin-product-row:last-child { border-bottom: none; }
  .admin-product-emoji { width: 36px; height: 36px; background: #f5f0eb; border-radius: 3px; display: flex; align-items: center; justify-content: center; font-size: 18px; flex-shrink: 0; }
  .admin-product-name { font-size: 12px; font-weight: 600; color: var(--text); flex: 1; }
  .stock-low { color: #e74c3c; font-weight: 700; font-size: 11px; }
  .stock-ok { color: #27ae60; font-weight: 700; font-size: 11px; }
  .progress-bar { height: 4px; background: #f0f0f0; border-radius: 2px; margin-top: 4px; overflow: hidden; }
  .progress-fill { height: 100%; border-radius: 2px; background: linear-gradient(90deg, var(--teal), #2ecc9a); }
`;

const PRODUCTS = [
  { id:1, emoji:"👗", name:"Floral Wrap Dress",  brand:"Zara",         size:"S",        price:499,  orig:1800, tag:"Vintage",  cond:"Excellent" },
  { id:2, emoji:"👜", name:"Leather Tote Bag",   brand:"Mango",        size:"One Size", price:799,  orig:2500, tag:"90s",      cond:"Good"      },
  { id:3, emoji:"🧥", name:"Oversized Blazer",   brand:"H&M",          size:"M",        price:649,  orig:2200, tag:"Y2K",      cond:"Like New"  },
  { id:4, emoji:"👟", name:"Canvas Sneakers",    brand:"Vans",         size:"7",        price:399,  orig:1400, tag:"Classic",  cond:"Good"      },
  { id:5, emoji:"👚", name:"Striped Linen Top",  brand:"Gap",          size:"XS",       price:299,  orig:900,  tag:"Summer",   cond:"Excellent" },
  { id:6, emoji:"🩱", name:"Denim Jumpsuit",     brand:"Levis",        size:"M",        price:899,  orig:3200, tag:"Trending", cond:"Like New"  },
  { id:7, emoji:"🧣", name:"Silk Scarf",         brand:"Uniqlo",       size:"One Size", price:199,  orig:600,  tag:"Vintage",  cond:"Good"      },
  { id:8, emoji:"🩴", name:"Block Heel Mules",   brand:"Steve Madden", size:"6",        price:549,  orig:1900, tag:"Summer",   cond:"Excellent" },
];

const TAGS = ["All","Vintage","90s","Y2K","Classic","Summer","Trending"];
const SIZES = ["XS","S","M","L","XL"];

const ORDER_HISTORY = [
  { id:"#PL-2041", date:"2 Mar 2026",  status:"Delivered", items:[PRODUCTS[0], PRODUCTS[2]], total:1148 },
  { id:"#PL-1987", date:"18 Feb 2026", status:"Shipped",   items:[PRODUCTS[1]],              total:799  },
  { id:"#PL-1834", date:"5 Feb 2026",  status:"Delivered", items:[PRODUCTS[3], PRODUCTS[6]], total:598  },
];

function pwStr(pw) {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
}
const segCls = (i,s) => s>=i ? ["","w","f","g","x"][s] : "";
function goTo(id) { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); }

function Register({ onLogin }) {
  const [f, setF] = useState({first:"",last:"",email:"",pw:"",pw2:"",terms:false});
  const [err, setErr] = useState({});
  const [sp, setSp] = useState(false);
  const [sp2, setSp2] = useState(false);
  const [load, setLoad] = useState(false);
  const [ok, setOk] = useState(false);
  const upd = k => e => { const v = e.target.type==="checkbox"?e.target.checked:e.target.value; setF(x=>({...x,[k]:v})); setErr(x=>({...x,[k]:""})); };
  const submit = async () => {
    const e={};
    if (!f.first.trim()) e.first="Required";
    if (!f.last.trim()) e.last="Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email="Valid email required";
    if (f.pw.length<8) e.pw="Min 8 characters";
    if (f.pw!==f.pw2) e.pw2="Passwords don't match";
    if (!f.terms) e.terms="Please accept to continue";
    if (Object.keys(e).length){setErr(e);return;}
    setLoad(true);
    await new Promise(r=>setTimeout(r,1400));
    setLoad(false); setOk(true);
    setTimeout(()=>{ onLogin(f.first); goTo("page5"); }, 1000);
  };
  const s = pwStr(f.pw);
  if (ok) return <div className="done"><div className="done-icon">✓</div><h3>Welcome to PreLoud!</h3><p>Account created.<br/>Taking you to your cart…</p></div>;
  return (
    <>
      <div className="row2">
        <div className="field"><label>First Name</label><input placeholder="Jane" value={f.first} onChange={upd("first")}/>{err.first&&<div className="ferr">{err.first}</div>}</div>
        <div className="field"><label>Last Name</label><input placeholder="Doe" value={f.last} onChange={upd("last")}/>{err.last&&<div className="ferr">{err.last}</div>}</div>
      </div>
      <div className="field"><label>Email</label><input type="email" placeholder="jane@example.com" value={f.email} onChange={upd("email")}/>{err.email&&<div className="ferr">{err.email}</div>}</div>
      <div className="field">
        <label>Password</label>
        <div className="pw-wrap"><input type={sp?"text":"password"} placeholder="Min. 8 characters" value={f.pw} onChange={upd("pw")}/><button className="eye" onClick={()=>setSp(v=>!v)} type="button">{sp?"🙈":"👁"}</button></div>
        {f.pw&&<><div className="str-row">{[1,2,3,4].map(i=><div key={i} className={`s ${segCls(i,s)}`}/>)}</div><div style={{fontSize:10,marginTop:3,color:s<=1?"#c0392b":s===2?"#e67e22":s===3?"#1a7a5e":"#27ae60"}}>{["","Weak","Fair","Good","Strong"][s]}</div></>}
        {err.pw&&<div className="ferr">{err.pw}</div>}
      </div>
      <div className="field">
        <label>Confirm Password</label>
        <div className="pw-wrap"><input type={sp2?"text":"password"} placeholder="Repeat password" value={f.pw2} onChange={upd("pw2")}/><button className="eye" onClick={()=>setSp2(v=>!v)} type="button">{sp2?"🙈":"👁"}</button></div>
        {err.pw2&&<div className="ferr">{err.pw2}</div>}
      </div>
      <div className="chk">
        <input type="checkbox" id="t" checked={f.terms} onChange={upd("terms")}/>
        <label htmlFor="t">I agree to the <a href="#">Terms</a> & <a href="#">Privacy Policy</a>{err.terms&&<><br/><span style={{color:"#c0392b",fontSize:10}}>{err.terms}</span></>}</label>
      </div>
      <button className="btn-sub" onClick={submit} disabled={load}>{load?"Creating account…":"Create Account →"}</button>
      <div className="divider">or sign up with</div>
      <div className="socs"><button className="soc">Google</button><button className="soc">Facebook</button></div>
    </>
  );
}

function Login({ onLogin }) {
  const [f, setF] = useState({email:"",pw:""});
  const [sp, setSp] = useState(false);
  const [load, setLoad] = useState(false);
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState({});
  const upd = k => e => { setF(x=>({...x,[k]:e.target.value})); setErr(x=>({...x,[k]:""})); };
  const submit = async () => {
    const e={};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email="Valid email required";
    if (!f.pw) e.pw="Password required";
    if (Object.keys(e).length){setErr(e);return;}
    setLoad(true);
    await new Promise(r=>setTimeout(r,1200));
    setLoad(false); setOk(true);
    setTimeout(()=>{ onLogin("User"); goTo("page5"); }, 1000);
  };
  if (ok) return <div className="done"><div className="done-icon">👋</div><h3>Welcome back!</h3><p>Signed in to PreLoud.<br/>Taking you to your cart…</p></div>;
  return (
    <>
      <div className="field"><label>Email</label><input type="email" placeholder="jane@example.com" value={f.email} onChange={upd("email")}/>{err.email&&<div className="ferr">{err.email}</div>}</div>
      <div className="field">
        <label>Password</label>
        <div className="pw-wrap"><input type={sp?"text":"password"} placeholder="Your password" value={f.pw} onChange={upd("pw")}/><button className="eye" onClick={()=>setSp(v=>!v)} type="button">{sp?"🙈":"👁"}</button></div>
        {err.pw&&<div className="ferr">{err.pw}</div>}
      </div>
      <a href="#" className="forgot">Forgot password?</a>
      <button className="btn-sub" onClick={submit} disabled={load}>{load?"Signing in…":"Sign In →"}</button>
      <div className="divider">or continue with</div>
      <div className="socs"><button className="soc">Google</button><button className="soc">Facebook</button></div>
    </>
  );
}

export default function App() {
  const [tab, setTab] = useState("reg");
  const [filter, setFilter] = useState("All");
  const [liked, setLiked] = useState({});
  const [product, setProduct] = useState(null);
  const [size, setSize] = useState("M");
  const [cart, setCart] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [payMethod, setPayMethod] = useState("UPI");
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filtered = filter==="All" ? PRODUCTS : PRODUCTS.filter(p=>p.tag===filter);
  const addToCart = (p, sz) => { setCart(c => { const ex = c.find(x=>x.id===p.id&&x.size===sz); if(ex) return c.map(x=>x.id===p.id&&x.size===sz?{...x,qty:x.qty+1}:x); return [...c,{...p,size:sz,qty:1}]; }); };
  const removeFromCart = (id,sz) => setCart(c=>c.filter(x=>!(x.id===id&&x.size===sz)));
  const changeQty = (id,sz,d) => setCart(c=>c.map(x=>x.id===id&&x.size===sz?{...x,qty:Math.max(1,x.qty+d)}:x));
  const cartTotal = cart.reduce((s,x)=>s+x.price*x.qty,0);
  const cartCount = cart.reduce((s,x)=>s+x.qty,0);
  const handleLogin = (name) => { setLoggedIn(true); setUserName(name); };
  const placeOrder = () => { setOrderPlaced(true); setCart([]); };

  return (
    <>
      <style>{css}</style>
      <div className="app">

        {/* PAGE 1 — HOME */}
        <div className="page home" id="page1">
          <img src="/logo.png" alt="PreLoud" className="home-logo" />
          <p className="home-tagline">local online thrift</p>
          <div className="home-hint" onClick={()=>goTo("page2")}>
            <span>Swipe up to explore</span>
            <div className="chevron" />
          </div>
        </div>

        {/* PAGE 2 — PRODUCT LISTING */}
        <div className="page listing" id="page2">
          <div className="topnav">
            <img src="/logo.png" alt="PreLoud" className="nav-logo" onClick={()=>goTo("page1")} />
            <div className="nav-links">
              <span className="active">Women</span><span>Men</span><span>Accessories</span><span>Bags</span><span>Shoes</span>
            </div>
            <div className="nav-icons">
              <span>🔍</span>
              <div className="cart-badge" onClick={()=>goTo("page5")}><span>🛒</span>{cartCount>0&&<div className="badge">{cartCount}</div>}</div>
              <span onClick={()=>goTo("page7")}>📦</span>
              <span onClick={()=>goTo("page8")}>⚙️</span>
            </div>
          </div>
          <div className="listing-content">
            <div className="listing-top">
              <h2 className="listing-heading">All Finds</h2>
              <span className="item-count">{filtered.length} items</span>
            </div>
            <div className="filters">
              {TAGS.map(t=><button key={t} className={`chip ${filter===t?"on":""}`} onClick={()=>setFilter(t)}>{t}</button>)}
            </div>
            <div className="grid">
              {filtered.map(p=>(
                <div key={p.id} className="pcard" onClick={()=>{ setProduct(p); goTo("page3"); }}>
                  <div className="pcard-img">{p.emoji}</div>
                  <div className="pcard-body">
                    <div className="pcard-tag">{p.tag}</div>
                    <div className="pcard-name">{p.name}</div>
                    <div className="pcard-sub">Size {p.size} · {p.brand}</div>
                    <div className="pcard-foot">
                      <div><span className="pcard-price">₹{p.price}</span><span className="pcard-orig">₹{p.orig}</span></div>
                      <button className={`heart ${liked[p.id]?"on":""}`} onClick={e=>{e.stopPropagation();setLiked(l=>({...l,[p.id]:!l[p.id]}));}}>{liked[p.id]?"♥":"♡"}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* PAGE 3 — PRODUCT DETAIL */}
        <div className="page detail" id="page3">
          <div className="topnav">
            <button style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"var(--muted)"}} onClick={()=>goTo("page2")}>←</button>
            <img src="/logo.png" alt="PreLoud" className="nav-logo" onClick={()=>goTo("page1")} />
            <div className="cart-badge" onClick={()=>goTo("page5")}><span>🛒</span>{cartCount>0&&<div className="badge">{cartCount}</div>}</div>
          </div>
          {product ? (
            <div className="detail-content">
              <div>
                <div className="big-img">{product.emoji}</div>
                <div className="thumbs">{[product.emoji,"📸","🏷️","📦"].map((e,i)=><div key={i} className={`thumb ${i===0?"on":""}`}>{e}</div>)}</div>
              </div>
              <div className="detail-right">
                <div className="d-badge">✦ {product.tag}</div>
                <h2 className="d-name">{product.name}</h2>
                <p className="d-brand">by {product.brand}</p>
                <div className="d-price-row">
                  <span className="d-price">₹{product.price}</span>
                  <span className="d-orig">₹{product.orig}</span>
                  <span className="d-save">{Math.round((1-product.price/product.orig)*100)}% off</span>
                </div>
                <div className="d-divider"/>
                <div className="d-label">Select Size</div>
                <div className="sizes">{SIZES.map(sz=><button key={sz} className={`sz ${size===sz?"on":""}`} onClick={()=>setSize(sz)}>{sz}</button>)}</div>
                <div className="d-label">Condition</div>
                <div className="condition-row"><div className="cond-dot"/><div><div className="cond-text">{product.cond}</div><div className="cond-sub">Verified by PreLoud team</div></div></div>
                <button className="btn-cart" onClick={()=>{ addToCart(product,size); goTo("page4"); }}>Add to Cart → Login to Buy</button>
                <button className="btn-wish">♡ Add to Wishlist</button>
                <div className="meta">
                  <div className="meta-row"><span>Brand</span><b>{product.brand}</b></div>
                  <div className="meta-row"><span>Size</span><b>{size}</b></div>
                  <div className="meta-row"><span>Condition</span><b>{product.cond}</b></div>
                  <div className="meta-row"><span>Listed</span><b>2 days ago</b></div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:12}}>
              <span style={{fontSize:48}}>👆</span>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontStyle:"italic",color:"#aaa"}}>Click any product to see details</p>
            </div>
          )}
        </div>

        {/* PAGE 4 — AUTH */}
        <div className="page auth" id="page4">
          <div className="auth-bg"/>
          <div className="auth-overlay"/>
          <div className="auth-card">
            <div className="card-top"><img src="/logo.png" alt="PreLoud" className="card-logo"/></div>
            <div className="tabs">
              <button className={`tab ${tab==="reg"?"on":""}`} onClick={()=>setTab("reg")}>Register</button>
              <button className={`tab ${tab==="log"?"on":""}`} onClick={()=>setTab("log")}>Sign In</button>
            </div>
            <div className="card-body">
              {tab==="reg" ? <Register key="r" onLogin={handleLogin}/> : <Login key="l" onLogin={handleLogin}/>}
            </div>
          </div>
        </div>

        {/* PAGE 5 — CART */}
        <div className="page cartpage" id="page5">
          <div className="topnav">
            <img src="/logo.png" alt="PreLoud" className="nav-logo" onClick={()=>goTo("page1")} />
            <div className="nav-links">
              <span onClick={()=>goTo("page2")}>Shop</span>
              <span onClick={()=>goTo("page7")}>Orders</span>
              <span onClick={()=>goTo("page8")}>Admin</span>
            </div>
            <div className="nav-icons">
              {loggedIn&&<span style={{fontSize:12,fontWeight:700,color:"var(--teal)"}}>Hi, {userName}!</span>}
            </div>
          </div>
          <div className="page-content">
            <h2 className="page-heading">Your Cart</h2>
            {cart.length===0 ? (
              <div className="empty-cart">
                <span>🛒</span>
                <p>Your cart is empty</p>
                <button onClick={()=>goTo("page2")}>Browse Products</button>
              </div>
            ) : (
              <div className="cart-grid">
                <div className="cart-items">
                  {cart.map((item,i)=>(
                    <div key={i} className="cart-item">
                      <div className="cart-item-emoji">{item.emoji}</div>
                      <div className="cart-item-info">
                        <div className="cart-item-name">{item.name}</div>
                        <div className="cart-item-sub">{item.brand} · Size {item.size}</div>
                        <div className="cart-item-foot">
                          <div className="cart-item-price">₹{item.price*item.qty}</div>
                          <div className="qty-ctrl">
                            <button className="qty-btn" onClick={()=>changeQty(item.id,item.size,-1)}>−</button>
                            <span className="qty-num">{item.qty}</span>
                            <button className="qty-btn" onClick={()=>changeQty(item.id,item.size,1)}>+</button>
                          </div>
                          <button className="remove-btn" onClick={()=>removeFromCart(item.id,item.size)}>Remove</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div className="summary-title">Order Summary</div>
                  <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                  <div className="summary-row"><span>Delivery</span><span style={{color:"var(--teal)"}}>Free</span></div>
                  <div className="summary-row"><span>Discount</span><span style={{color:"var(--purple)"}}>−₹{Math.round(cartTotal*0.05)}</span></div>
                  <div className="summary-row total"><span>Total</span><span>₹{cartTotal-Math.round(cartTotal*0.05)}</span></div>
                  <button className="btn-checkout" onClick={()=>goTo("page6")}>Proceed to Checkout →</button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* PAGE 6 — CHECKOUT */}
        <div className="page checkout" id="page6">
          <div className="topnav">
            <button style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:"var(--muted)"}} onClick={()=>goTo("page5")}>←</button>
            <img src="/logo.png" alt="PreLoud" className="nav-logo" onClick={()=>goTo("page1")} />
            <div style={{width:80}}/>
          </div>
          {orderPlaced ? (
            <div className="order-placed">
              <div className="order-placed-icon">🎉</div>
              <h2>Order Placed!</h2>
              <p>Thank you for shopping with PreLoud. Your order will be delivered in 3–5 business days.</p>
              <button onClick={()=>{ setOrderPlaced(false); goTo("page7"); }}>View Order History</button>
            </div>
          ) : (
            <div className="page-content">
              <h2 className="page-heading">Checkout</h2>
              <div className="checkout-grid">
                <div>
                  <div className="checkout-section">
                    <div className="section-title">Delivery Address</div>
                    <div className="form-grid">
                      <div className="form-field"><label>Full Name</label><input placeholder="Jane Doe" defaultValue={userName}/></div>
                      <div className="form-field"><label>Phone</label><input placeholder="+91 98765 43210"/></div>
                      <div className="form-field full"><label>Address</label><input placeholder="Flat no, Street, Area"/></div>
                      <div className="form-field"><label>City</label><input placeholder="Chennai"/></div>
                      <div className="form-field"><label>Pincode</label><input placeholder="600001"/></div>
                      <div className="form-field"><label>State</label><select><option>Tamil Nadu</option><option>Karnataka</option><option>Maharashtra</option><option>Delhi</option></select></div>
                    </div>
                  </div>
                  <div className="checkout-section">
                    <div className="section-title">Payment Method</div>
                    <div className="pay-methods">
                      {["UPI","Card","COD","Wallet"].map(m=><div key={m} className={`pay-method ${payMethod===m?"on":""}`} onClick={()=>setPayMethod(m)}>{m}</div>)}
                    </div>
                    {payMethod==="UPI"&&<div className="form-grid"><div className="form-field full"><label>UPI ID</label><input placeholder="jane@upi"/></div></div>}
                    {payMethod==="Card"&&<div className="form-grid"><div className="form-field full"><label>Card Number</label><input placeholder="1234 5678 9012 3456"/></div><div className="form-field"><label>Expiry</label><input placeholder="MM/YY"/></div><div className="form-field"><label>CVV</label><input placeholder="•••"/></div></div>}
                    {payMethod==="COD"&&<p style={{fontSize:12,color:"var(--muted)"}}>Pay cash on delivery. ₹30 extra COD charge applies.</p>}
                    {payMethod==="Wallet"&&<div className="form-grid"><div className="form-field full"><label>Wallet</label><select><option>Paytm</option><option>PhonePe</option><option>Amazon Pay</option></select></div></div>}
                  </div>
                </div>
                <div className="order-summary-box">
                  <div className="summary-title">Items ({cart.length})</div>
                  {cart.map((item,i)=>(
                    <div key={i} className="order-item-row">
                      <div className="order-item-emoji">{item.emoji}</div>
                      <div><div className="order-item-name">{item.name}</div><div className="order-item-sub">Qty: {item.qty} · Size {item.size}</div></div>
                      <div className="order-item-price">₹{item.price*item.qty}</div>
                    </div>
                  ))}
                  <div style={{height:1,background:"#f0f0f0",margin:"12px 0"}}/>
                  <div className="summary-row"><span>Subtotal</span><span>₹{cartTotal}</span></div>
                  <div className="summary-row"><span>Delivery</span><span style={{color:"var(--teal)"}}>Free</span></div>
                  <div className="summary-row total"><span>Total</span><span>₹{cartTotal-Math.round(cartTotal*0.05)}</span></div>
                  <button className="place-order-btn" onClick={placeOrder}>Place Order 🎉</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PAGE 7 — ORDER HISTORY */}
        <div className="page history" id="page7">
          <div className="topnav">
            <img src="/logo.png" alt="PreLoud" className="nav-logo" onClick={()=>goTo("page1")} />
            <div className="nav-links">
              <span onClick={()=>goTo("page2")}>Shop</span>
              <span onClick={()=>goTo("page5")}>Cart</span>
              <span onClick={()=>goTo("page8")}>Admin</span>
            </div>
            <div className="nav-icons">{loggedIn&&<span style={{fontSize:12,fontWeight:700,color:"var(--teal)"}}>Hi, {userName}!</span>}</div>
          </div>
          <div className="page-content">
            <h2 className="page-heading">Order History</h2>
            {ORDER_HISTORY.map((order,i)=>(
              <div key={i} className="order-card">
                <div className="order-card-head">
                  <div><div className="order-id">{order.id}</div><div className="order-date">{order.date}</div></div>
                  <div className={`order-status ${order.status==="Delivered"?"status-delivered":order.status==="Shipped"?"status-shipped":"status-processing"}`}>{order.status}</div>
                </div>
                <div className="order-items-row">
                  {order.items.map((item,j)=><div key={j} className="order-thumb">{item.emoji}</div>)}
                  <div style={{fontSize:12,color:"var(--muted)",alignSelf:"center",marginLeft:4}}>{order.items.map(x=>x.name).join(", ")}</div>
                </div>
                <div className="order-card-foot">
                  <div className="order-total">₹{order.total}</div>
                  <button className="reorder-btn" onClick={()=>goTo("page2")}>Reorder</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PAGE 8 — ADMIN DASHBOARD */}
        <div className="page admin" id="page8">
          <div className="admin-topnav">
            <div className="admin-topnav-title">PreLoud Admin Dashboard</div>
            <div style={{display:"flex",alignItems:"center",gap:16}}>
              <div className="admin-badge">Admin</div>
              <span style={{color:"#fff",fontSize:18,cursor:"pointer"}} onClick={()=>goTo("page2")}>🏠</span>
            </div>
          </div>
          <div className="admin-content">
            <div className="stats-grid">
              {[
                {icon:"💰", val:"₹48,290", label:"Total Revenue",   change:"↑ 12% this month", up:true},
                {icon:"🛍️", val:"284",     label:"Total Orders",    change:"↑ 8% this week",   up:true},
                {icon:"👥", val:"1,432",   label:"Total Users",     change:"↑ 24 new today",   up:true},
                {icon:"👗", val:"96",      label:"Active Listings", change:"↓ 3 sold today",   up:false},
              ].map((s,i)=>(
                <div key={i} className="stat-card">
                  <div className="stat-icon">{s.icon}</div>
                  <div className="stat-val">{s.val}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className={`stat-change ${s.up?"up":"down"}`}>{s.change}</div>
                </div>
              ))}
            </div>
            <div className="admin-grid">
              <div className="admin-section">
                <div className="admin-section-title">Recent Orders <span>View All</span></div>
                {[
                  {id:"#PL-2044",user:"Priya S.",   amt:"₹1,248",status:"Processing"},
                  {id:"#PL-2043",user:"Kavya R.",   amt:"₹499",  status:"Shipped"},
                  {id:"#PL-2042",user:"Ananya M.",  amt:"₹899",  status:"Delivered"},
                  {id:"#PL-2041",user:"Divya K.",   amt:"₹1,148",status:"Delivered"},
                  {id:"#PL-2040",user:"Sneha P.",   amt:"₹199",  status:"Shipped"},
                ].map((o,i)=>(
                  <div key={i} className="admin-order-row">
                    <div><div className="admin-order-id">{o.id}</div><div className="admin-order-user">{o.user}</div></div>
                    <div className="admin-order-amt">{o.amt}</div>
                    <div className={`order-status ${o.status==="Delivered"?"status-delivered":o.status==="Shipped"?"status-shipped":"status-processing"}`} style={{fontSize:9}}>{o.status}</div>
                  </div>
                ))}
              </div>
              <div className="admin-section">
                <div className="admin-section-title">Product Inventory <span>Manage</span></div>
                {PRODUCTS.slice(0,5).map((p,i)=>{
                  const stock=[3,12,7,1,18][i];
                  return (
                    <div key={i} className="admin-product-row">
                      <div className="admin-product-emoji">{p.emoji}</div>
                      <div style={{flex:1}}><div className="admin-product-name">{p.name}</div><div className="progress-bar"><div className="progress-fill" style={{width:`${Math.min(100,stock*5)}%`}}/></div></div>
                      <div className={stock<=3?"stock-low":"stock-ok"}>{stock} left</div>
                    </div>
                  );
                })}
              </div>
              <div className="admin-section">
                <div className="admin-section-title">Sales by Category</div>
                {[{tag:"Vintage",pct:34},{tag:"Y2K",pct:28},{tag:"Trending",pct:18},{tag:"Summer",pct:12},{tag:"Classic",pct:8}].map((c,i)=>(
                  <div key={i} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}>
                      <span style={{fontWeight:600,color:"var(--text)"}}>{c.tag}</span>
                      <span style={{color:"var(--teal)",fontWeight:700}}>{c.pct}%</span>
                    </div>
                    <div className="progress-bar"><div className="progress-fill" style={{width:`${c.pct}%`,background:"linear-gradient(90deg, var(--purple), #c06dd4)"}}/></div>
                  </div>
                ))}
              </div>
              <div className="admin-section">
                <div className="admin-section-title">Quick Actions</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  {[{icon:"➕",label:"Add Product"},{icon:"📦",label:"Manage Orders"},{icon:"👥",label:"View Users"},{icon:"💳",label:"Payouts"},{icon:"🏷️",label:"Discounts"},{icon:"📊",label:"Reports"}].map((a,i)=>(
                    <button key={i} style={{padding:"12px 8px",border:"1.5px solid #e0e8e4",borderRadius:3,background:"#fff",cursor:"pointer",fontSize:12,fontWeight:700,color:"var(--text)",display:"flex",alignItems:"center",gap:8,fontFamily:"'Nunito',sans-serif"}}>
                      <span style={{fontSize:18}}>{a.icon}</span>{a.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
