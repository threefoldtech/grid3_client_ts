class ComputeCapacity {
    // min disk size reserved (to make sure you have growth potential)
    // when reserved it means you payment
    // if you use more, you pay for it
    challenge() {
        let out = "";
        out += this.cpu || "";
        out += this.memory || "";
        return out;
    }
}
export { ComputeCapacity };
