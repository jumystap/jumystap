import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Carousel } from 'antd';

export default function Slider() {
    return(
        <Carousel autoplay>
            <div className="w-full bg-blue-900 h-[300px] mt-5 rounded-lg">
                <div>SLide 1</div>
            </div>
            <div className="w-full bg-blue-300 h-[300px] mt-5 rounded-lg">
                <div>SLide 2</div>
            </div>
            <div className="w-full bg-orange-500 h-[300px] mt-5 rounded-lg">
                <div>SLide 3</div>
            </div>
        </Carousel>
    )
}