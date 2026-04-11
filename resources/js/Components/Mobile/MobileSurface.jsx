export default function MobileSurface({
    as: Component = "div",
    className = "",
    children,
}) {
    const classes = ["jt-mobile-surface", className].filter(Boolean).join(" ");

    return <Component className={classes}>{children}</Component>;
}
