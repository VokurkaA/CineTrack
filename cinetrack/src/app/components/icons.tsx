import type { SVGProps, ReactNode } from "react";

type IconBaseProps = SVGProps<SVGSVGElement> & {
    children?: ReactNode;
};

const IconBase = ({
    children,
    viewBox = "0 0 24 24",
    ...props
}: IconBaseProps & { viewBox?: string }) => {
    return (
        <svg
            viewBox={viewBox}
            fill="currentColor"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {children}
        </svg>
    );
};

export const AppleIcon = (props: IconBaseProps) => (
    <IconBase {...props} viewBox="0 0 48 48">
        <g clipPath="url(#clip0_17_53)">
            <path d="M43.5839 37.4071C42.858 39.0841 41.9988 40.6277 41.0033 42.047C39.6463 43.9817 38.5352 45.3209 37.6789 46.0646C36.3516 47.2853 34.9294 47.9105 33.4065 47.946C32.3132 47.946 30.9947 47.6349 29.4599 47.0039C27.9201 46.3757 26.5051 46.0646 25.2112 46.0646C23.8542 46.0646 22.3988 46.3757 20.8421 47.0039C19.2831 47.6349 18.0271 47.9638 17.0668 47.9964C15.6064 48.0586 14.1508 47.4157 12.6978 46.0646C11.7704 45.2558 10.6105 43.8691 9.22087 41.9047C7.72995 39.807 6.50422 37.3745 5.54395 34.6013C4.51554 31.6058 4 28.7051 4 25.8969C4 22.6801 4.69509 19.9057 6.08734 17.5807C7.18153 15.7132 8.63718 14.2401 10.4591 13.1586C12.2809 12.0772 14.2495 11.5261 16.3694 11.4908C17.5293 11.4908 19.0505 11.8497 20.9408 12.5548C22.8258 13.2623 24.0361 13.6212 24.5667 13.6212C24.9635 13.6212 26.308 13.2016 28.5874 12.3652C30.7428 11.5895 32.562 11.2683 34.0524 11.3948C38.0908 11.7208 41.1247 13.3127 43.1425 16.1808C39.5307 18.3692 37.7441 21.4342 37.7797 25.3663C37.8123 28.429 38.9233 30.9777 41.107 33.0013C42.0966 33.9405 43.2017 34.6664 44.4313 35.182C44.1646 35.9553 43.8832 36.696 43.5839 37.4071ZM34.322 0.960792C34.322 3.36134 33.445 5.60273 31.6969 7.67733C29.5873 10.1436 27.0357 11.5688 24.2687 11.3439C24.2334 11.0559 24.213 10.7528 24.213 10.4343C24.213 8.12976 25.2162 5.66346 26.9978 3.64693C27.8872 2.62593 29.0185 1.77697 30.3903 1.09975C31.7591 0.432629 33.0539 0.0636968 34.2716 0.000518799C34.3072 0.321435 34.322 0.642371 34.322 0.960761V0.960792Z" fill="black" />
        </g>
        <defs>
            <clipPath id="clip0_17_53">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    </IconBase>
)

export const LinkedInIcon = (props: IconBaseProps) => (
    <IconBase {...props} viewBox="0 0 48 48">
        <g clipPath="url(#clip0_17_32)">
            <path d="M44.4567 0H3.54333C2.60358 0 1.70232 0.373315 1.03782 1.03782C0.373315 1.70232 0 2.60358 0 3.54333V44.4567C0 45.3964 0.373315 46.2977 1.03782 46.9622C1.70232 47.6267 2.60358 48 3.54333 48H44.4567C45.3964 48 46.2977 47.6267 46.9622 46.9622C47.6267 46.2977 48 45.3964 48 44.4567V3.54333C48 2.60358 47.6267 1.70232 46.9622 1.03782C46.2977 0.373315 45.3964 0 44.4567 0ZM14.3067 40.89H7.09V17.9667H14.3067V40.89ZM10.6933 14.79C9.87473 14.7854 9.07583 14.5384 8.39747 14.0802C7.71911 13.622 7.19168 12.9731 6.88175 12.2154C6.57183 11.4577 6.4933 10.6252 6.65606 9.82291C6.81883 9.02063 7.2156 8.28455 7.79631 7.70756C8.37702 7.13057 9.11563 6.73853 9.91893 6.58092C10.7222 6.42331 11.5542 6.50719 12.3099 6.82197C13.0656 7.13675 13.7111 7.66833 14.1649 8.34962C14.6188 9.03092 14.8606 9.83138 14.86 10.65C14.8677 11.1981 14.765 11.7421 14.558 12.2496C14.351 12.7571 14.044 13.2178 13.6551 13.6041C13.2663 13.9905 12.8037 14.2946 12.2948 14.4983C11.786 14.702 11.2413 14.8012 10.6933 14.79ZM40.9067 40.91H33.6933V28.3867C33.6933 24.6933 32.1233 23.5533 30.0967 23.5533C27.9567 23.5533 25.8567 25.1667 25.8567 28.48V40.91H18.64V17.9833H25.58V21.16H25.6733C26.37 19.75 28.81 17.34 32.5333 17.34C36.56 17.34 40.91 19.73 40.91 26.73L40.9067 40.91Z" fill="#0A66C2" />
        </g>
        <defs>
            <clipPath id="clip0_17_32">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    </IconBase>
)

export const InstagramIcon = (props: IconBaseProps) => (
    <IconBase {...props} viewBox="0 0 48 48">
        <g clipPath="url(#clip0_17_27)">
            <path d="M24 4.32187C30.4125 4.32187 31.1719 4.35 33.6938 4.4625C36.0375 4.56562 37.3031 4.95938 38.1469 5.2875C39.2625 5.71875 40.0688 6.24375 40.9031 7.07812C41.7469 7.92188 42.2625 8.71875 42.6938 9.83438C43.0219 10.6781 43.4156 11.9531 43.5188 14.2875C43.6313 16.8187 43.6594 17.5781 43.6594 23.9813C43.6594 30.3938 43.6313 31.1531 43.5188 33.675C43.4156 36.0188 43.0219 37.2844 42.6938 38.1281C42.2625 39.2438 41.7375 40.05 40.9031 40.8844C40.0594 41.7281 39.2625 42.2438 38.1469 42.675C37.3031 43.0031 36.0281 43.3969 33.6938 43.5C31.1625 43.6125 30.4031 43.6406 24 43.6406C17.5875 43.6406 16.8281 43.6125 14.3063 43.5C11.9625 43.3969 10.6969 43.0031 9.85313 42.675C8.7375 42.2438 7.93125 41.7188 7.09688 40.8844C6.25313 40.0406 5.7375 39.2438 5.30625 38.1281C4.97813 37.2844 4.58438 36.0094 4.48125 33.675C4.36875 31.1438 4.34063 30.3844 4.34063 23.9813C4.34063 17.5688 4.36875 16.8094 4.48125 14.2875C4.58438 11.9437 4.97813 10.6781 5.30625 9.83438C5.7375 8.71875 6.2625 7.9125 7.09688 7.07812C7.94063 6.23438 8.7375 5.71875 9.85313 5.2875C10.6969 4.95938 11.9719 4.56562 14.3063 4.4625C16.8281 4.35 17.5875 4.32187 24 4.32187ZM24 0C17.4844 0 16.6688 0.028125 14.1094 0.140625C11.5594 0.253125 9.80625 0.665625 8.2875 1.25625C6.70312 1.875 5.3625 2.69062 4.03125 4.03125C2.69063 5.3625 1.875 6.70313 1.25625 8.27813C0.665625 9.80625 0.253125 11.55 0.140625 14.1C0.028125 16.6687 0 17.4844 0 24C0 30.5156 0.028125 31.3312 0.140625 33.8906C0.253125 36.4406 0.665625 38.1938 1.25625 39.7125C1.875 41.2969 2.69063 42.6375 4.03125 43.9688C5.3625 45.3 6.70313 46.125 8.27813 46.7344C9.80625 47.325 11.55 47.7375 14.1 47.85C16.6594 47.9625 17.475 47.9906 23.9906 47.9906C30.5063 47.9906 31.3219 47.9625 33.8813 47.85C36.4313 47.7375 38.1844 47.325 39.7031 46.7344C41.2781 46.125 42.6188 45.3 43.95 43.9688C45.2812 42.6375 46.1063 41.2969 46.7156 39.7219C47.3063 38.1938 47.7188 36.45 47.8313 33.9C47.9438 31.3406 47.9719 30.525 47.9719 24.0094C47.9719 17.4938 47.9438 16.6781 47.8313 14.1188C47.7188 11.5688 47.3063 9.81563 46.7156 8.29688C46.125 6.70312 45.3094 5.3625 43.9688 4.03125C42.6375 2.7 41.2969 1.875 39.7219 1.26562C38.1938 0.675 36.45 0.2625 33.9 0.15C31.3313 0.028125 30.5156 0 24 0Z" fill="#000100" />
            <path d="M24 11.6719C17.1938 11.6719 11.6719 17.1938 11.6719 24C11.6719 30.8062 17.1938 36.3281 24 36.3281C30.8062 36.3281 36.3281 30.8062 36.3281 24C36.3281 17.1938 30.8062 11.6719 24 11.6719ZM24 31.9969C19.5844 31.9969 16.0031 28.4156 16.0031 24C16.0031 19.5844 19.5844 16.0031 24 16.0031C28.4156 16.0031 31.9969 19.5844 31.9969 24C31.9969 28.4156 28.4156 31.9969 24 31.9969Z" fill="#000100" />
            <path d="M39.6937 11.1844C39.6937 12.7782 38.4 14.0625 36.8156 14.0625C35.2219 14.0625 33.9375 12.7688 33.9375 11.1844C33.9375 9.59065 35.2313 8.30627 36.8156 8.30627C38.4 8.30627 39.6937 9.60003 39.6937 11.1844Z" fill="#000100" />
        </g>
        <defs>
            <clipPath id="clip0_17_27">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    </IconBase>
)
export const XIcon = (props: IconBaseProps) => (
    <IconBase {...props} viewBox="0 0 48 48">
        <path d="M36.6526 3.80782H43.3995L28.6594 20.6548L46 43.5798H32.4225L21.7881 29.6759L9.61989 43.5798H2.86886L18.6349 25.56L2 3.80782H15.9222L25.5348 16.5165L36.6526 3.80782ZM34.2846 39.5414H38.0232L13.8908 7.63408H9.87892L34.2846 39.5414Z" fill="black" />
    </IconBase>
)

export const GithubIcon = (props: IconBaseProps) => (
    <IconBase {...props} viewBox="0 0 48 48">
        <g clipPath="url(#clip0_910_21)">
            <path fillRule="evenodd" clipRule="evenodd" d="M24.0199 0C10.7375 0 0 10.8167 0 24.1983C0 34.895 6.87988 43.9495 16.4241 47.1542C17.6174 47.3951 18.0545 46.6335 18.0545 45.9929C18.0545 45.4319 18.0151 43.509 18.0151 41.5055C11.3334 42.948 9.94198 38.6209 9.94198 38.6209C8.86818 35.8164 7.27715 35.0956 7.27715 35.0956C5.09022 33.6132 7.43645 33.6132 7.43645 33.6132C9.86233 33.7735 11.1353 36.0971 11.1353 36.0971C13.2824 39.7827 16.7422 38.7413 18.1341 38.1002C18.3328 36.5377 18.9695 35.456 19.6455 34.8552C14.3163 34.2942 8.70937 32.211 8.70937 22.9161C8.70937 20.2719 9.66321 18.1086 11.1746 16.4261C10.9361 15.8253 10.1008 13.3409 11.4135 10.0157C11.4135 10.0157 13.4417 9.3746 18.0146 12.4996C19.9725 11.9699 21.9916 11.7005 24.0199 11.6982C26.048 11.6982 28.1154 11.979 30.0246 12.4996C34.5981 9.3746 36.6262 10.0157 36.6262 10.0157C37.9389 13.3409 37.1031 15.8253 36.8646 16.4261C38.4158 18.1086 39.3303 20.2719 39.3303 22.9161C39.3303 32.211 33.7234 34.2539 28.3544 34.8552C29.2296 35.6163 29.9848 37.0583 29.9848 39.3421C29.9848 42.5871 29.9454 45.1915 29.9454 45.9924C29.9454 46.6335 30.383 47.3951 31.5758 47.1547C41.12 43.9491 47.9999 34.895 47.9999 24.1983C48.0392 10.8167 37.2624 0 24.0199 0Z" fill="#24292F" />
        </g>
        <defs>
            <clipPath id="clip0_910_21">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    </IconBase>
)

export const GoogleIcon = (props: IconBaseProps) => (
    <IconBase {...props} viewBox="0 0 48 48">
        <mask id="mask0_17_40" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">
            <path d="M47.5391 19.5474H24.5112V28.7747H37.7431C37.5304 30.0805 37.0528 31.3652 36.3534 32.5366C35.552 33.8786 34.5613 34.9004 33.5459 35.6785C30.5042 38.0093 26.958 38.4859 24.4952 38.4859C18.2738 38.4859 12.9581 34.4649 10.9002 29.0011C10.8172 28.8029 10.762 28.5981 10.6949 28.3956C10.2401 27.005 9.99169 25.5323 9.99169 24.0015C9.99169 22.4084 10.2607 20.8835 10.7513 19.4432C12.6864 13.7628 18.122 9.52012 24.4997 9.52012C25.7824 9.52012 27.0178 9.67282 28.1892 9.97738C30.8665 10.6734 32.7603 12.0442 33.9207 13.1286L40.9225 6.27151C36.6634 2.36633 31.1111 5.90435e-09 24.488 5.90435e-09C19.1933 -0.000113959 14.305 1.64956 10.2992 4.43757C7.05062 6.69857 4.38633 9.72576 2.58825 13.2415C0.915782 16.5013 0 20.1138 0 23.9979C0 27.8822 0.917181 31.5322 2.58966 34.7619V34.7837C4.3562 38.2124 6.93949 41.1646 10.0792 43.4152C12.8221 45.3814 17.7403 48 24.488 48C28.3684 48 31.8075 47.3004 34.8405 45.9893C37.0285 45.0435 38.9671 43.8098 40.7222 42.2244C43.0413 40.1294 44.8575 37.5382 46.0972 34.557C47.3369 31.5757 48 28.2044 48 24.5493C48 22.8471 47.829 21.1184 47.5391 19.5473V19.5474Z" fill="white" />
        </mask>
        <g mask="url(#mask0_17_40)">
            <g filter="url(#filter0_f_17_40)">
                <path d="M-0.2771 24.1023C-0.251646 27.9253 0.8377 31.8696 2.48661 35.0538V35.0757C3.67802 37.3881 5.30634 39.2148 7.16097 41.0246L18.3625 36.9374C16.2432 35.8609 15.9198 35.2013 14.4007 33.9976C12.8482 32.4322 11.6912 30.6351 10.9706 28.5278H10.9416L10.9706 28.5059C10.4966 27.1144 10.4498 25.6373 10.4323 24.1023H-0.2771Z" fill="url(#paint0_radial_17_40)" />
            </g>
            <g filter="url(#filter1_f_17_40)">
                <path d="M24.5875 -0.233215C23.4803 3.65637 23.9037 7.43718 24.5875 9.63702C25.866 9.63797 27.0976 9.79037 28.2654 10.094C30.9427 10.79 32.8363 12.1609 33.9967 13.2452L41.1778 6.21297C36.9237 2.31245 31.8041 -0.22707 24.5875 -0.233215Z" fill="url(#paint1_radial_17_40)" />
            </g>
            <g filter="url(#filter2_f_17_40)">
                <path d="M24.5635 -0.263977C19.1328 -0.264094 14.1191 1.42793 10.0104 4.28752C8.48491 5.34929 7.08495 6.57581 5.83838 7.93972C5.51181 11.0034 8.28302 14.7691 13.7709 14.7379C16.4335 11.6406 20.3716 9.63667 24.7546 9.63667C24.7586 9.63667 24.7625 9.637 24.7665 9.63701L24.5875 -0.263276C24.5794 -0.263281 24.5716 -0.263977 24.5635 -0.263977Z" fill="url(#paint2_radial_17_40)" />
            </g>
            <g filter="url(#filter3_f_17_40)">
                <path d="M42.4876 25.2109L37.6404 28.5408C37.4277 29.8467 36.9498 31.1313 36.2503 32.3027C35.449 33.6448 34.4584 34.6666 33.4429 35.4447C30.4075 37.7707 26.8707 38.2496 24.4085 38.2515C21.8636 42.586 21.4175 44.757 24.5875 48.2552C28.5101 48.2523 31.9877 47.5443 35.0551 46.2183C37.2724 45.2598 39.2369 44.0096 41.0156 42.4028C43.3658 40.2798 45.2067 37.6537 46.463 34.6325C47.7193 31.6112 48.3911 28.1948 48.3911 24.4908L42.4876 25.2109Z" fill="url(#paint3_radial_17_40)" />
            </g>
            <g filter="url(#filter4_f_17_40)">
                <path d="M24.2295 19.1382V29.0666H47.5506C47.7557 27.7069 48.434 25.9474 48.434 24.4908C48.434 22.7885 48.2632 20.7094 47.9733 19.1382H24.2295Z" fill="#3086FF" />
            </g>
            <g filter="url(#filter5_f_17_40)">
                <path d="M5.94966 7.5892C4.51051 9.16383 3.28103 10.9263 2.3062 12.8324C0.633758 16.0922 -0.281982 20.0552 -0.281982 23.9393C-0.281982 23.9941 -0.277452 24.0476 -0.277087 24.1022C0.463586 25.5224 9.95397 25.2504 10.4323 24.1022C10.4317 24.0487 10.4257 23.9964 10.4257 23.9427C10.4257 22.3497 10.6948 21.1754 11.1854 19.7352C11.7906 17.9586 12.7382 16.3227 13.9499 14.9131C14.2246 14.5625 14.9573 13.8086 15.171 13.3564C15.2524 13.1841 15.0232 13.0875 15.0104 13.0268C14.996 12.959 14.6887 13.0135 14.6198 12.963C14.4011 12.8027 13.9682 12.7189 13.7053 12.6445C13.1433 12.4854 12.212 12.1345 11.6947 11.7707C10.0596 10.621 7.50794 9.24759 5.94966 7.5892Z" fill="url(#paint4_radial_17_40)" />
            </g>
            <g filter="url(#filter6_f_17_40)">
                <path d="M11.7299 13.0336C15.5215 15.3304 16.6119 11.8743 19.1328 10.7928L14.7476 1.69913C13.1345 2.37712 11.6104 3.21946 10.1963 4.20365C8.08448 5.67348 6.21956 7.46709 4.67902 9.50825L11.7299 13.0336Z" fill="url(#paint5_radial_17_40)" />
            </g>
            <g filter="url(#filter7_f_17_40)">
                <path d="M13.2731 36.2349C8.1833 38.0724 7.38648 38.1383 6.91797 41.2925C7.81327 42.1662 8.7752 42.9744 9.79741 43.7071C12.5403 45.6733 17.8164 48.2919 24.5641 48.2919C24.572 48.2919 24.5796 48.2912 24.5875 48.2912V38.0763C24.5824 38.0763 24.5765 38.0766 24.5714 38.0766C22.0447 38.0766 20.0255 37.413 17.9553 36.2589C17.4448 35.9743 16.5188 36.7384 16.048 36.3968C15.3987 35.9257 13.8362 36.8027 13.2731 36.2349Z" fill="url(#paint6_radial_17_40)" />
            </g>
            <g opacity="0.5" filter="url(#filter8_f_17_40)">
                <path d="M21.6067 37.7545V48.1142C22.5508 48.2248 23.5334 48.2919 24.5641 48.2919C25.5973 48.2919 26.597 48.2388 27.5683 48.1413V37.8244C26.4798 38.0105 25.4546 38.0766 24.5714 38.0766C23.5543 38.0766 22.5651 37.9582 21.6067 37.7545Z" fill="url(#paint7_linear_17_40)" />
            </g>
        </g>
        <defs>
            <filter id="filter0_f_17_40" x="-0.747179" y="23.6322" width="19.5797" height="17.8625" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.23504" result="effect1_foregroundBlur_17_40" />
            </filter>
            <filter id="filter1_f_17_40" x="23.4367" y="-0.703295" width="18.2112" height="14.4186" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.23504" result="effect1_foregroundBlur_17_40" />
            </filter>
            <filter id="filter2_f_17_40" x="5.34242" y="-0.734056" width="19.8941" height="15.9422" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.23504" result="effect1_foregroundBlur_17_40" />
            </filter>
            <filter id="filter3_f_17_40" x="21.8837" y="24.0207" width="26.9775" height="24.7046" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.23504" result="effect1_foregroundBlur_17_40" />
            </filter>
            <filter id="filter4_f_17_40" x="23.7594" y="18.6682" width="25.1447" height="10.8685" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.23504" result="effect1_foregroundBlur_17_40" />
            </filter>
            <filter id="filter5_f_17_40" x="-0.752062" y="7.11912" width="16.4106" height="18.419" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.23504" result="effect1_foregroundBlur_17_40" />
            </filter>
            <filter id="filter6_f_17_40" x="1.37417" y="-1.60572" width="21.0634" height="18.7161" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="1.65243" result="effect1_foregroundBlur_17_40" />
            </filter>
            <filter id="filter7_f_17_40" x="6.44789" y="35.7239" width="18.6097" height="13.0381" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.23504" result="effect1_foregroundBlur_17_40" />
            </filter>
            <filter id="filter8_f_17_40" x="21.1366" y="37.2845" width="6.90177" height="11.4775" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="0.23504" result="effect1_foregroundBlur_17_40" />
            </filter>
            <radialGradient id="paint0_radial_17_40" cx="0" cy="0" r="1" gradientTransform="matrix(-0.997443 -23.9038 35.8622 -1.43445 18.1382 40.6645)" gradientUnits="userSpaceOnUse">
                <stop offset="0.141612" stopColor="#1ABD4D" />
                <stop offset="0.247515" stopColor="#6EC30D" />
                <stop offset="0.311547" stopColor="#8AC502" />
                <stop offset="0.366013" stopColor="#A2C600" />
                <stop offset="0.445673" stopColor="#C8C903" />
                <stop offset="0.540305" stopColor="#EBCB03" />
                <stop offset="0.615636" stopColor="#F7CD07" />
                <stop offset="0.699345" stopColor="#FDCD04" />
                <stop offset="0.771242" stopColor="#FDCE05" />
                <stop offset="0.860566" stopColor="#FFCE0A" />
            </radialGradient>
            <radialGradient id="paint1_radial_17_40" cx="0" cy="0" r="1" gradientTransform="matrix(16.9393 -4.07113e-05 -2.38089e-05 21.4185 40.506 12.7364)" gradientUnits="userSpaceOnUse">
                <stop offset="0.408458" stopColor="#FB4E5A" />
                <stop offset="1" stopColor="#FF4540" />
            </radialGradient>
            <radialGradient id="paint2_radial_17_40" cx="0" cy="0" r="1" gradientTransform="matrix(-23.7332 12.8698 17.8375 31.532 31.2553 -3.36438)" gradientUnits="userSpaceOnUse">
                <stop offset="0.231273" stopColor="#FF4541" />
                <stop offset="0.311547" stopColor="#FF4540" />
                <stop offset="0.457516" stopColor="#FF4640" />
                <stop offset="0.540305" stopColor="#FF473F" />
                <stop offset="0.699346" stopColor="#FF5138" />
                <stop offset="0.771242" stopColor="#FF5B33" />
                <stop offset="0.860566" stopColor="#FF6C29" />
                <stop offset="1" stopColor="#FF8C18" />
            </radialGradient>
            <radialGradient id="paint3_radial_17_40" cx="0" cy="0" r="1" gradientTransform="matrix(-43.0409 -55.0094 -20.7393 15.555 24.9404 45.1486)" gradientUnits="userSpaceOnUse">
                <stop offset="0.131546" stopColor="#0CBA65" />
                <stop offset="0.209784" stopColor="#0BB86D" />
                <stop offset="0.297297" stopColor="#09B479" />
                <stop offset="0.396257" stopColor="#08AD93" />
                <stop offset="0.477124" stopColor="#0AA6A9" />
                <stop offset="0.568425" stopColor="#0D9CC6" />
                <stop offset="0.667385" stopColor="#1893DD" />
                <stop offset="0.768727" stopColor="#258BF1" />
                <stop offset="0.858506" stopColor="#3086FF" />
            </radialGradient>
            <radialGradient id="paint4_radial_17_40" cx="0" cy="0" r="1" gradientTransform="matrix(-3.04591 25.7043 36.3002 4.12336 22.4842 4.26946)" gradientUnits="userSpaceOnUse">
                <stop offset="0.366013" stopColor="#FF4E3A" />
                <stop offset="0.457516" stopColor="#FF8A1B" />
                <stop offset="0.540305" stopColor="#FFA312" />
                <stop offset="0.615636" stopColor="#FFB60C" />
                <stop offset="0.771242" stopColor="#FFCD0A" />
                <stop offset="0.860566" stopColor="#FECF0A" />
                <stop offset="0.915033" stopColor="#FECF08" />
                <stop offset="1" stopColor="#FDCD01" />
            </radialGradient>
            <radialGradient id="paint5_radial_17_40" cx="0" cy="0" r="1" gradientTransform="matrix(-8.80425 9.53355 -27.4644 -24.3132 18.2009 4.00284)" gradientUnits="userSpaceOnUse">
                <stop offset="0.315904" stopColor="#FF4C3C" />
                <stop offset="0.603818" stopColor="#FF692C" />
                <stop offset="0.726837" stopColor="#FF7825" />
                <stop offset="0.884534" stopColor="#FF8D1B" />
                <stop offset="1" stopColor="#FF9F13" />
            </radialGradient>
            <radialGradient id="paint6_radial_17_40" cx="0" cy="0" r="1" gradientTransform="matrix(-23.7332 -12.8698 17.8375 -31.532 31.2553 51.2464)" gradientUnits="userSpaceOnUse">
                <stop offset="0.231273" stopColor="#0FBC5F" />
                <stop offset="0.311547" stopColor="#0FBC5F" />
                <stop offset="0.366013" stopColor="#0FBC5E" />
                <stop offset="0.457516" stopColor="#0FBC5D" />
                <stop offset="0.540305" stopColor="#12BC58" />
                <stop offset="0.699346" stopColor="#28BF3C" />
                <stop offset="0.771242" stopColor="#38C02B" />
                <stop offset="0.860566" stopColor="#52C218" />
                <stop offset="0.915033" stopColor="#67C30F" />
                <stop offset="1" stopColor="#86C504" />
            </radialGradient>
            <linearGradient id="paint7_linear_17_40" x1="21.6067" y1="43.0232" x2="27.5683" y2="43.0232" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0FBC5C" />
                <stop offset="1" stopColor="#0CBA65" />
            </linearGradient>
        </defs>
    </IconBase>
)

export const FacebookIcon = (props: IconBaseProps) => (
    <IconBase {...props} viewBox="0 0 48 48">
        <g clipPath="url(#clip0_17_24)">
            <path d="M48 24C48 10.7453 37.2547 0 24 0C10.7453 0 0 10.7453 0 24C0 35.255 7.74912 44.6995 18.2026 47.2934V31.3344H13.2538V24H18.2026V20.8397C18.2026 12.671 21.8995 8.8848 29.9194 8.8848C31.44 8.8848 34.0637 9.18336 35.137 9.48096V16.129C34.5706 16.0694 33.5866 16.0397 32.3645 16.0397C28.4294 16.0397 26.9088 17.5306 26.9088 21.4061V24H34.7482L33.4013 31.3344H26.9088V47.8243C38.7926 46.3891 48.001 36.2707 48.001 24H48Z" fill="#0866FF" />
            <path d="M33.4003 31.3344L34.7472 24H26.9078V21.4061C26.9078 17.5306 28.4285 16.0397 32.3635 16.0397C33.5856 16.0397 34.5696 16.0694 35.136 16.129V9.48096C34.0627 9.1824 31.439 8.8848 29.9184 8.8848C21.8986 8.8848 18.2016 12.671 18.2016 20.8397V24H13.2528V31.3344H18.2016V47.2934C20.0582 47.7542 22.0003 48 23.999 48C24.983 48 25.9536 47.9395 26.9069 47.8243V31.3344H33.3994H33.4003Z" fill="white" />
        </g>
        <defs>
            <clipPath id="clip0_17_24">
                <rect width="48" height="48" fill="white" />
            </clipPath>
        </defs>
    </IconBase>
)
