import React, { useContext, useEffect, useState } from 'react';
import { StorageCartContext } from '../../contexts/storagecartContext';
import { useNavigate } from 'react-router-dom';
import { PORT } from '../../constants';
import AlertMessage from '../../View/AlertMessage';

const Payment = () => {
    const push = useNavigate();
    const path = PORT;
    const { listStorage, sendlistpayment, getStorageCart, storageLoading } = useContext(StorageCartContext);
    const [alert, setalert] = useState(null);
    const arr = listStorage.map((data) => Number(data.toltalmoney || 0));

    const [loadingpaymen, setloadingpaymen] = useState(false);
    const sum = arr.reduce((total, amount) => total + amount, 30000);
    const [addresss, setAddress] = useState({
        address: '',
        tell: ''
    });
    const { address, tell } = addresss;

    const onchangeInputAddress = (e) => {
        setAddress({ ...addresss, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        getStorageCart();
    }, []);

    const submittheoder = async () => {
        try {
            if (!address.trim()) {
                setalert({ type: 'danger', message: 'Vui lòng nhập địa chỉ nhận hàng.' });
                return;
            }
            if (!Array.isArray(listStorage) || listStorage.length === 0) {
                setalert({ type: 'danger', message: 'Giỏ hàng đang trống. Vui lòng chọn sản phẩm trước khi đặt hàng.' });
                return;
            }
            if (!/^0[0-9]{9,10}$/.test(tell)) {
                setalert({ type: 'danger', message: 'Vui lòng nhập số điện thoại hợp lệ (10–11 chữ số).' });
                return;
            }
            setloadingpaymen(true);
            const result = await sendlistpayment(address, tell);
            if (result?.success === false) {
                setloadingpaymen(false);
                setalert({ type: 'danger', message: result.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.' });
                return;
            }
            push('/finishedoder');
        } catch (error) {
            setloadingpaymen(false);
            setalert({ type: 'danger', message: 'Không thể kết nối để tạo đơn hàng. Vui lòng thử lại.' });
        }
    };

    if (loadingpaymen || !storageLoading) {
        const isSubmitting = loadingpaymen;

        return (
            <main className="payment-loading-screen" role="status" aria-live="polite" aria-busy="true">
                <style>{`
                    .payment-loading-screen {
                        position: fixed;
                        inset: 0;
                        z-index: 9999;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        padding: 24px;
                        background: radial-gradient(ellipse at 50% 38%, rgba(31, 105, 160, .22) 0%, rgba(7, 16, 29, .96) 58%, #050b14 100%);
                        font-family: inherit;
                    }
                    .payment-loading-card {
                        width: min(100%, 390px);
                        padding: 38px 30px 32px;
                        text-align: center;
                        color: #f8fafc;
                        border: 1px solid rgba(148, 190, 222, .2);
                        border-radius: 24px;
                        background: linear-gradient(145deg, rgba(20, 38, 58, .94), rgba(9, 22, 37, .96));
                        box-shadow: 0 24px 80px rgba(0, 0, 0, .38), inset 0 1px 0 rgba(255,255,255,.06);
                        backdrop-filter: blur(16px);
                    }
                    .payment-loader {
                        position: relative;
                        display: grid;
                        place-items: center;
                        width: 76px;
                        height: 76px;
                        margin: 0 auto 24px;
                    }
                    .payment-loader-ring {
                        position: absolute;
                        inset: 0;
                        border: 3px solid rgba(96, 165, 250, .16);
                        border-top-color: #60a5fa;
                        border-right-color: #38bdf8;
                        border-radius: 50%;
                        animation: payment-spin .95s linear infinite;
                    }
                    .payment-loader-core {
                        display: grid;
                        place-items: center;
                        width: 48px;
                        height: 48px;
                        color: #bae6fd;
                        border-radius: 16px;
                        background: linear-gradient(145deg, rgba(56, 189, 248, .2), rgba(37, 99, 235, .18));
                        font-size: 23px;
                    }
                    .payment-loading-title {
                        margin: 0 0 9px;
                        font-size: 21px;
                        line-height: 1.35;
                        font-weight: 700;
                        letter-spacing: -.35px;
                    }
                    .payment-loading-description {
                        margin: 0;
                        color: #a9bbcd;
                        font-size: 14px;
                        line-height: 1.7;
                    }
                    .payment-loading-dots {
                        display: flex;
                        justify-content: center;
                        gap: 7px;
                        margin-top: 23px;
                    }
                    .payment-loading-dots span {
                        width: 6px;
                        height: 6px;
                        border-radius: 50%;
                        background: #60a5fa;
                        animation: payment-pulse 1.1s ease-in-out infinite;
                    }
                    .payment-loading-dots span:nth-child(2) { animation-delay: .15s; }
                    .payment-loading-dots span:nth-child(3) { animation-delay: .3s; }
                    @keyframes payment-spin { to { transform: rotate(360deg); } }
                    @keyframes payment-pulse {
                        0%, 60%, 100% { opacity: .35; transform: translateY(0); }
                        30% { opacity: 1; transform: translateY(-5px); }
                    }
                    @media (prefers-reduced-motion: reduce) {
                        .payment-loader-ring, .payment-loading-dots span { animation: none; }
                    }
                `}</style>
                <section className="payment-loading-card">
                    <div className="payment-loader" aria-hidden="true">
                        <div className="payment-loader-ring" />
                        <div className="payment-loader-core">▣</div>
                    </div>
                    <h1 className="payment-loading-title">
                        {isSubmitting ? 'Đang xử lý đơn hàng' : 'Đang tải thanh toán'}
                    </h1>
                    <p className="payment-loading-description">
                        {isSubmitting
                            ? 'Vui lòng chờ trong giây lát. Đừng tải lại hoặc đóng trang này.'
                            : 'Chúng tôi đang chuẩn bị thông tin giỏ hàng của bạn.'}
                    </p>
                    <div className="payment-loading-dots" aria-hidden="true">
                        <span /><span /><span />
                    </div>
                </section>
            </main>
        );
    }

    return <div className='containerPaymenent mt-5'>
        <div className='itemPayment'>
            <div className='topcontainerPayment'>
                <marquee>
                    Nếu Bạn muốn Hổ trợ Vui lòng Liên hệ 0389998053 Hoặc Email:xhieu213@gmail.com
                </marquee>
            </div>
            <AlertMessage info={alert}></AlertMessage>
            <div className='d-flex justify-content-center'>
                <span style={{ color: 'lawngreen', fontSize: '30px', fontWeight: '600' }}>Số tiền bạn thanh toán là : {sum.toLocaleString('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                })}</span>
            </div>
            <div>
                <h4 style={{ textAlign: 'center', color: 'white', fontWeight: '300', fontSize: '20px' }}>Điạ Chỉ</h4>
                <input name="address" required value={address} placeholder="Nhập địa chỉ nhận hàng" onChange={onchangeInputAddress} size={50} style={{ height: '50px' }} />
            </div>
            <div>
                <h4 className='mt-5' style={{ textAlign: 'center', color: 'white' }}>Số điện thoại</h4>
                <input maxLength={11} required placeholder="Nhập số điện thoại" onChange={onchangeInputAddress} name="tell" value={tell} min={0} max={15} size={20} type="tel" />
            </div>
            <button onClick={submittheoder} className='mt-3'>Đặt Hàng</button>
        </div>
        <div className='itemPayment2'>
            {listStorage.map((data, index) => (
                <div key={index} className="childrenboxcart">
                    <img src={path + data.img} alt="ảnh sản phẩm" />
                    <h4 style={{ fontWeight: '500', fontSize: '20px', marginLeft: '5px' }}>{data.title}</h4>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <button style={{ width: '5rem', background: '#333', color: 'white', border: 'none', fontWeight: 'bold' }}>Số lượng</button>
                        <p style={{ textAlign: 'center', fontWeight: 'bold', border: '1px solid white', margin: '0px' }}>{data.quantily}</p>
                    </div>
                    <p style={{ width: '10rem' }}>{data.toltalmoney.toLocaleString('vi-VN', {
                        style: 'currency',
                        currency: 'VND',
                    })}</p>
                </div>
            ))}
        </div>
    </div>;
};

export default Payment;
